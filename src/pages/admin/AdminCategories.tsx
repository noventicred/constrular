import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit2, Trash2, Search, Folder, FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  created_at: string;
}

const AdminCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as categorias.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/categorias/editar/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Categoria excluída com sucesso!',
      });

      fetchCategories();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getCategoryHierarchy = (categoryId: string | null): Category[] => {
    return categories.filter(cat => cat.parent_id === categoryId);
  };

  const getParentName = (parentId: string | null): string => {
    if (!parentId) return '';
    const parent = categories.find(cat => cat.id === parentId);
    return parent ? parent.name : '';
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categorias</h1>
          <p className="text-muted-foreground">Gerencie as categorias dos produtos</p>
        </div>
        <Button onClick={() => navigate('/admin/categorias/nova')}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Categorias</CardTitle>
          <CardDescription>
            Total: {filteredCategories.length} categorias
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar categorias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Imagem</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {category.parent_id ? (
                        <>
                          <Folder className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{category.name}</span>
                        </>
                      ) : (
                        <>
                          <FolderOpen className="h-4 w-4 text-primary" />
                          <span className="font-bold">{category.name}</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={category.parent_id ? "secondary" : "default"}>
                      {category.parent_id ? `Subcategoria de ${getParentName(category.parent_id)}` : 'Principal'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {category.image_url ? (
                      <img 
                        src={category.image_url} 
                        alt={category.name}
                        className="w-8 h-8 rounded object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                        <Folder className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {category.description || 'Sem descrição'}
                  </TableCell>
                  <TableCell>
                    {new Date(category.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(category.id)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCategories;