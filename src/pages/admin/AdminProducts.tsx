import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit2, Trash2, Search, Star, Percent, AlertTriangle, TrendingUp, Filter, X } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  discount: number;
  image_url: string | null;
  category_id: string | null;
  in_stock: boolean;
  is_featured: boolean;
  is_special_offer: boolean;
  rating: number;
  reviews: number;
  created_at: string;
  sku: string | null;
  categories?: { name: string };
}

interface Category {
  id: string;
  name: string;
}

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const [offerFilter, setOfferFilter] = useState('all');
  const [featuredCount, setFeaturedCount] = useState(0);
  const [specialOfferCount, setSpecialOfferCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
      
      // Count featured and special offer products
      const featured = data?.filter(p => p.is_featured).length || 0;
      const specialOffers = data?.filter(p => p.is_special_offer).length || 0;
      setFeaturedCount(featured);
      setSpecialOfferCount(specialOffers);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os produtos.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/produtos/editar/${id}`);
  };


  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Produto excluído com sucesso!',
      });

      fetchProducts();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
    }
  };


  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category_id === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'in_stock' && product.in_stock) ||
      (statusFilter === 'out_stock' && !product.in_stock);
    const matchesFeatured = featuredFilter === 'all' ||
      (featuredFilter === 'featured' && product.is_featured) ||
      (featuredFilter === 'not_featured' && !product.is_featured);
    const matchesOffer = offerFilter === 'all' ||
      (offerFilter === 'offer' && product.is_special_offer) ||
      (offerFilter === 'not_offer' && !product.is_special_offer);

    return matchesSearch && matchesCategory && matchesStatus && matchesFeatured && matchesOffer;
  });

  const clearAllFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setFeaturedFilter('all');
    setOfferFilter('all');
  };

  const hasActiveFilters = searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' || 
    featuredFilter !== 'all' || offerFilter !== 'all';

  const formatPrice = (price: number) => {
    return formatCurrency(price);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground">Gerencie os produtos do seu e-commerce</p>
        </div>
        <Button onClick={() => navigate('/admin/produtos/novo')} size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Total</span>
            </div>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">produtos cadastrados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-muted-foreground">Em Destaque</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">{featuredCount}/12</div>
            <p className="text-xs text-muted-foreground">limite máximo</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-muted-foreground">Ofertas</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">{specialOfferCount}/20</div>
            <p className="text-xs text-muted-foreground">limite máximo</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-4 w-4 rounded-full p-0 bg-green-500" />
              <span className="text-sm font-medium text-muted-foreground">Em Estoque</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {products.filter(p => p.in_stock).length}
            </div>
            <p className="text-xs text-muted-foreground">produtos disponíveis</p>
          </CardContent>
        </Card>
      </div>

      {/* Limit Warnings */}
      {featuredCount >= 12 && (
        <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-200">
            <strong>Limite atingido:</strong> Você já tem {featuredCount} produtos em destaque (máximo: 12). 
            Remova alguns para adicionar novos produtos em destaque.
          </AlertDescription>
        </Alert>
      )}
      
      {specialOfferCount >= 20 && (
        <Alert className="border-primary/20 bg-primary/5 dark:bg-primary/10">
          <AlertTriangle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-primary dark:text-primary">
            <strong>Limite atingido:</strong> Você já tem {specialOfferCount} ofertas especiais (máximo: 20). 
            Remova algumas para adicionar novas ofertas.
          </AlertDescription>
        </Alert>
      )}

      {/* Products Table */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Lista de Produtos</CardTitle>
              <CardDescription>
                Mostrando {filteredProducts.length} de {products.length} produtos
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2 bg-muted/30 rounded-lg px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 w-64"
              />
            </div>
          </div>
          
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="in_stock">Em estoque</SelectItem>
                  <SelectItem value="out_stock">Fora de estoque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Destaque</label>
              <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="featured">Em destaque</SelectItem>
                  <SelectItem value="not_featured">Não destacado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Oferta</label>
              <Select value={offerFilter} onValueChange={setOfferFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="offer">Em oferta</SelectItem>
                  <SelectItem value="not_offer">Sem oferta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium opacity-0">Ações</label>
              <Button 
                variant="outline" 
                onClick={clearAllFilters}
                disabled={!hasActiveFilters}
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Limpar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="font-semibold text-foreground">Produto</TableHead>
                  <TableHead className="font-semibold text-foreground">Categoria</TableHead>
                  <TableHead className="font-semibold text-foreground">Preço</TableHead>
                  <TableHead className="font-semibold text-foreground">Status</TableHead>
                  <TableHead className="font-semibold text-foreground text-center">Destacado</TableHead>
                  <TableHead className="font-semibold text-foreground text-center">Oferta</TableHead>
                  <TableHead className="font-semibold text-foreground text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow 
                    key={product.id} 
                    className="group hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {product.image_url ? (
                            <img 
                              src={(() => {
                                try {
                                  const parsed = JSON.parse(product.image_url);
                                  return Array.isArray(parsed) ? parsed[0] : product.image_url;
                                } catch {
                                  return product.image_url;
                                }
                              })()} 
                              alt={product.name} 
                              className="w-12 h-12 rounded-lg object-cover border shadow-sm"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg";
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-muted border flex items-center justify-center">
                              <div className="w-6 h-6 bg-muted-foreground/20 rounded" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-foreground truncate">
                            {product.name}
                          </div>
                          <div className="text-sm text-muted-foreground truncate">
                            SKU: {product.sku || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell className="py-4">
                      <Badge variant="outline" className="font-normal">
                        {product.categories?.name || 'Sem categoria'}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="py-4">
                      <div className="font-semibold text-foreground">
                        {formatPrice(product.price)}
                      </div>
                      {product.original_price && product.original_price > product.price && (
                        <div className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.original_price)}
                        </div>
                      )}
                    </TableCell>
                    
                    <TableCell className="py-4">
                      <Badge 
                        variant={product.in_stock ? 'default' : 'secondary'}
                        className={product.in_stock ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                      >
                        {product.in_stock ? 'Em estoque' : 'Fora de estoque'}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="py-4 text-center">
                      {product.is_featured ? (
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 gap-1">
                          <Star className="h-3 w-3 fill-current" />
                          Destaque
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    
                    <TableCell className="py-4 text-center">
                      {product.is_special_offer ? (
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/10 gap-1">
                          <Percent className="h-3 w-3" />
                          Oferta
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    
                    <TableCell className="py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(product.id)}
                          className="h-8 w-8 p-0 opacity-60 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(product.id)}
                          className="h-8 w-8 p-0 opacity-60 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProducts;