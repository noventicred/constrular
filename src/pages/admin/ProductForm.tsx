import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Upload, X, Image as ImageIcon } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  original_price: string;
  discount: string;
  category_id: string;
  in_stock: boolean;
}

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [existingImageUrl, setExistingImageUrl] = useState<string>('');

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    original_price: '',
    discount: '',
    category_id: '',
    in_stock: true,
  });

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchProduct();
    }
  }, [id, isEditing]);

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

  const fetchProduct = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setFormData({
        name: data.name,
        description: data.description || '',
        price: data.price.toString(),
        original_price: data.original_price?.toString() || '',
        discount: data.discount.toString(),
        category_id: data.category_id || '',
        in_stock: data.in_stock,
      });

      if (data.image_url) {
        setExistingImageUrl(data.image_url);
        setImagePreview(data.image_url);
      }
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar o produto.',
        variant: 'destructive',
      });
      navigate('/admin/produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setExistingImageUrl('');
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return existingImageUrl || null;

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao fazer upload da imagem.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrl = await uploadImage();

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        discount: parseInt(formData.discount) || 0,
        image_url: imageUrl,
        category_id: formData.category_id || null,
        in_stock: formData.in_stock,
      };

      let error;
      if (isEditing) {
        ({ error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', id));
      } else {
        ({ error } = await supabase
          .from('products')
          .insert([productData]));
      }

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: `Produto ${isEditing ? 'atualizado' : 'criado'} com sucesso!`,
      });

      navigate('/admin/produtos');
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof ProductFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/produtos')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para produtos
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {isEditing ? 'Editar Produto' : 'Novo Produto'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isEditing ? 'Atualize as informações do produto' : 'Preencha os dados do novo produto'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna principal */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                  <CardDescription>
                    Dados principais do produto
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome do produto *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => updateFormData('name', e.target.value)}
                      placeholder="Digite o nome do produto"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => updateFormData('description', e.target.value)}
                      placeholder="Descreva o produto..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preços e Desconto</CardTitle>
                  <CardDescription>
                    Configure os valores do produto
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price">Preço atual *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => updateFormData('price', e.target.value)}
                        placeholder="0,00"
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="original_price">Preço original</Label>
                      <Input
                        id="original_price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.original_price}
                        onChange={(e) => updateFormData('original_price', e.target.value)}
                        placeholder="0,00"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="discount">Desconto (%)</Label>
                      <Input
                        id="discount"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.discount}
                        onChange={(e) => updateFormData('discount', e.target.value)}
                        placeholder="0"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) => updateFormData('category_id', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecionar categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="in_stock">Em estoque</Label>
                      <p className="text-sm text-muted-foreground">
                        Produto disponível para venda
                      </p>
                    </div>
                    <Switch
                      id="in_stock"
                      checked={formData.in_stock}
                      onCheckedChange={(value) => updateFormData('in_stock', value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Imagem do produto</CardTitle>
                  <CardDescription>
                    Adicione uma imagem para o produto
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={removeImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground">
                          Nenhuma imagem selecionada
                        </p>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="image" className="cursor-pointer">
                        <div className="flex items-center justify-center gap-2 p-2 border rounded-lg hover:bg-muted transition-colors">
                          <Upload className="h-4 w-4" />
                          Selecionar imagem
                        </div>
                      </Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/produtos')}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : isEditing ? 'Atualizar produto' : 'Criar produto'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;