import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Upload, X, ArrowLeft } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  created_at: string;
}

const CategoryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent_id: '',
    image_url: '',
  });

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchCategory();
    }
  }, [id]);

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
    }
  };

  const fetchCategory = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setFormData({
        name: data.name,
        description: data.description || '',
        parent_id: data.parent_id || '',
        image_url: data.image_url || '',
      });

      if (data.image_url) {
        setImagePreview(data.image_url);
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar a categoria.',
        variant: 'destructive',
      });
    }
  };

  const handleImageUpload = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `categories/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image_url;

      // Upload new image if selected
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
      }

      const categoryData = {
        name: formData.name,
        description: formData.description || null,
        parent_id: formData.parent_id || null,
        image_url: imageUrl || null,
      };

      let error;
      if (isEditing) {
        ({ error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', id));
      } else {
        ({ error } = await supabase
          .from('categories')
          .insert([categoryData]));
      }

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: `Categoria ${isEditing ? 'atualizada' : 'criada'} com sucesso!`,
      });

      navigate('/admin/categorias');
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter out current category from parent options to prevent circular reference
  const parentOptions = categories.filter(cat => cat.id !== id);

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/admin/categorias')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Atualize os dados da categoria' : 'Preencha os dados para criar uma nova categoria'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Categoria</CardTitle>
          <CardDescription>
            Configure os detalhes da categoria e organize a hierarquia do seu catálogo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Categoria *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Eletrônicos, Roupas, Casa e Jardim..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent_id">Categoria Pai</Label>
              <Select
                value={formData.parent_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, parent_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria pai (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhuma (Categoria Principal)</SelectItem>
                  {parentOptions.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Deixe em branco para criar uma categoria principal ou selecione uma categoria pai para criar uma subcategoria
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o que esta categoria inclui..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Imagem da Categoria</Label>
              <div className="space-y-4">
                {imagePreview ? (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                    <img
                      src={imagePreview}
                      alt="Preview da categoria"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1"
                      onClick={removeImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground text-center">
                      Clique para enviar
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
                <p className="text-sm text-muted-foreground">
                  Recomendado: 300x300px, formato JPG, PNG ou WebP
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/categorias')}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')} Categoria
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryForm;