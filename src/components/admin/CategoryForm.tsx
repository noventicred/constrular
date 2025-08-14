import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  created_at: string;
}

interface CategoryFormProps {
  categories: Category[];
  editingCategory: Category | null;
  onSave: () => void;
  onCancel: () => void;
}

export const CategoryForm = ({ categories, editingCategory, onSave, onCancel }: CategoryFormProps) => {
  const [formLoading, setFormLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(editingCategory?.image_url || null);
  const [formData, setFormData] = useState({
    name: editingCategory?.name || '',
    description: editingCategory?.description || '',
    parent_id: editingCategory?.parent_id || '',
    image_url: editingCategory?.image_url || '',
  });
  const { toast } = useToast();

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
    setFormLoading(true);

    try {
      let imageUrl = formData.image_url;

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
      if (editingCategory) {
        ({ error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id));
      } else {
        ({ error } = await supabase
          .from('categories')
          .insert([categoryData]));
      }

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: `Categoria ${editingCategory ? 'atualizada' : 'criada'} com sucesso!`,
      });

      onSave();
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setFormLoading(false);
    }
  };

  const parentOptions = categories.filter(cat => cat.id !== editingCategory?.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
        </CardTitle>
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
              onClick={onCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={formLoading} className="flex-1">
              {formLoading ? 'Salvando...' : (editingCategory ? 'Atualizar' : 'Criar')} Categoria
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};