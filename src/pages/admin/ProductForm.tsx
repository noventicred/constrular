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

interface Comment {
  id?: string;
  author_name: string;
  comment_text: string;
  rating: number;
  likes: number;
  dislikes: number;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  original_price: string;
  discount: string;
  category_id: string;
  sku: string;
  in_stock: boolean;
  is_featured: boolean;
  is_special_offer: boolean;
}

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<Comment>({
    author_name: '',
    comment_text: '',
    rating: 5,
    likes: 0,
    dislikes: 0
  });


  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    original_price: '',
    discount: '',
    category_id: '',
    sku: '',
    in_stock: true,
    is_featured: false,
    is_special_offer: false,
  });

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchProduct();
      fetchComments();
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
        discount: data.discount?.toString() || '0',
        category_id: data.category_id || '',
        sku: data.sku || '',
        in_stock: data.in_stock,
        is_featured: data.is_featured || false,
        is_special_offer: data.is_special_offer || false,
      });

      if (data.image_url) {
        try {
          // Tenta fazer parse como JSON para múltiplas imagens
          const imageUrls = typeof data.image_url === 'string' ? 
            (data.image_url.startsWith('[') ? JSON.parse(data.image_url) : [data.image_url]) : 
            [data.image_url];
          setExistingImageUrls(imageUrls);
          setImagePreviews(imageUrls);
        } catch {
          // Se não for JSON válido, trata como string única
          setExistingImageUrls([data.image_url]);
          setImagePreviews([data.image_url]);
        }
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

  const fetchComments = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('product_comments')
        .select('*')
        .eq('product_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const addComment = () => {
    if (!newComment.author_name.trim() || !newComment.comment_text.trim()) {
      toast({
        title: 'Erro',
        description: 'Nome do autor e comentário são obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    const comment: Comment = {
      id: Date.now().toString(),
      ...newComment,
      author_name: newComment.author_name.trim(),
      comment_text: newComment.comment_text.trim(),
    };

    setComments([comment, ...comments]);
    setNewComment({
      author_name: '',
      comment_text: '',
      rating: 5,
      likes: 0,
      dislikes: 0
    });

    toast({
      title: 'Sucesso',
      description: 'Comentário adicionado com sucesso!',
    });
  };

  const removeComment = (commentId: string) => {
    setComments(comments.filter(comment => comment.id !== commentId));
    toast({
      title: 'Sucesso',
      description: 'Comentário removido com sucesso!',
    });
  };

  const updateComment = (commentId: string, field: keyof Comment, value: any) => {
    setComments(comments.map(comment => 
      comment.id === commentId ? { ...comment, [field]: value } : comment
    ));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (imageFiles.length + files.length > 5) {
      toast({
        title: 'Limite excedido',
        description: 'Você pode selecionar no máximo 5 imagens.',
        variant: 'destructive',
      });
      return;
    }

    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);

    // Criar previews para os novos arquivos
    const newPreviews = [...imagePreviews];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        newPreviews.push(reader.result as string);
        setImagePreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    const newExistingUrls = existingImageUrls.filter((_, i) => i !== index);
    
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
    setExistingImageUrls(newExistingUrls);
  };

  const uploadImages = async (): Promise<string | null> => {
    if (imageFiles.length === 0 && existingImageUrls.length === 0) return null;

    try {
      const uploadedUrls = [...existingImageUrls];

      // Upload das novas imagens
      for (const file of imageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      // Se só tem uma imagem, retorna como string, senão como JSON
      return uploadedUrls.length === 1 ? uploadedUrls[0] : JSON.stringify(uploadedUrls);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao fazer upload das imagens.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrl = await uploadImages();

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        discount: parseInt(formData.discount) || 0,
        image_url: imageUrl,
        category_id: formData.category_id || null,
        sku: formData.sku.trim() || null,
        in_stock: formData.in_stock,
        is_featured: formData.is_featured,
        is_special_offer: formData.is_special_offer,
      };

      // Save comments
      if (comments.length > 0) {
        // Delete existing comments if editing
        if (isEditing) {
          await supabase
            .from('product_comments')
            .delete()
            .eq('product_id', id);
        }

        // Insert new comments
        const commentsData = comments.map(comment => ({
          product_id: isEditing ? id : undefined, // Will be set after product creation
          author_name: comment.author_name,
          comment_text: comment.comment_text,
          rating: comment.rating,
          likes: comment.likes,
          dislikes: comment.dislikes,
        }));

        if (isEditing) {
          commentsData.forEach(comment => { comment.product_id = id; });
          const { error: commentsError } = await supabase
            .from('product_comments')
            .insert(commentsData);
          
          if (commentsError) {
            console.error('Error saving comments:', commentsError);
          }
        }
      }

      let error;
      let productId = id;
      
      if (isEditing) {
        ({ error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', id));
      } else {
        const { data: newProduct, error: insertError } = await supabase
          .from('products')
          .insert([productData])
          .select('id')
          .single();
        
        error = insertError;
        if (newProduct) {
          productId = newProduct.id;
          
          // Save comments for new product
          if (comments.length > 0) {
            const commentsData = comments.map(comment => ({
              product_id: productId,
              author_name: comment.author_name,
              comment_text: comment.comment_text,
              rating: comment.rating,
              likes: comment.likes,
              dislikes: comment.dislikes,
            }));

            const { error: commentsError } = await supabase
              .from('product_comments')
              .insert(commentsData);
            
            if (commentsError) {
              console.error('Error saving comments:', commentsError);
            }
          }
        }
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => updateFormData('sku', e.target.value)}
                        placeholder="Ex: ABC-123, PRD001..."
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Código único do produto (opcional)
                      </p>
                    </div>
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

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="is_featured">Produto em destaque</Label>
                      <p className="text-sm text-muted-foreground">
                        Exibir na seção de produtos em destaque
                      </p>
                    </div>
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(value) => updateFormData('is_featured', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="is_special_offer">Oferta especial</Label>
                      <p className="text-sm text-muted-foreground">
                        Exibir em ofertas especiais
                      </p>
                    </div>
                    <Switch
                      id="is_special_offer"
                      checked={formData.is_special_offer}
                      onCheckedChange={(value) => updateFormData('is_special_offer', value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Imagens do produto</CardTitle>
                  <CardDescription>
                    Adicione até 5 imagens para o produto
                    <br />
                    <span className="text-xs text-blue-600 font-medium">
                      💡 Tamanho ideal: 800x800px (quadrada) | Formato: JPG, PNG | Máx: 2MB por imagem
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Grid de imagens */}
                    {imagePreviews.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            {index === 0 && (
                              <div className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-1 rounded">
                                Principal
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground">
                          Nenhuma imagem selecionada
                        </p>
                      </div>
                    )}

                    {/* Botão para adicionar mais imagens */}
                    {imagePreviews.length < 5 && (
                      <div>
                        <Label htmlFor="images" className="cursor-pointer">
                          <div className="flex items-center justify-center gap-2 p-2 border rounded-lg hover:bg-muted transition-colors">
                            <Upload className="h-4 w-4" />
                            {imagePreviews.length === 0 ? 'Selecionar imagens' : 'Adicionar mais imagens'}
                          </div>
                        </Label>
                        <Input
                          id="images"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          {imagePreviews.length}/5 imagens selecionadas
                          <br />
                          <span className="text-blue-600">
                            ✨ Primeira imagem será a principal nos cards e listas
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Seção de Comentários */}
          <Card>
            <CardHeader>
              <CardTitle>Comentários e Avaliações</CardTitle>
              <CardDescription>
                Gerencie os comentários e avaliações do produto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Formulário para novo comentário */}
              <div className="border rounded-lg p-4 bg-muted/50">
                <h4 className="font-medium mb-4">Adicionar novo comentário</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="author_name">Nome do autor</Label>
                    <Input
                      id="author_name"
                      value={newComment.author_name}
                      onChange={(e) => setNewComment({...newComment, author_name: e.target.value})}
                      placeholder="Nome do autor"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rating">Avaliação</Label>
                    <Select
                      value={newComment.rating.toString()}
                      onValueChange={(value) => setNewComment({...newComment, rating: parseInt(value)})}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 4, 3, 2, 1].map((star) => (
                          <SelectItem key={star} value={star.toString()}>
                            {star} estrela{star !== 1 ? 's' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="likes">Curtidas</Label>
                    <Input
                      id="likes"
                      type="number"
                      min="0"
                      value={newComment.likes}
                      onChange={(e) => setNewComment({...newComment, likes: parseInt(e.target.value) || 0})}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dislikes">Não curtiu</Label>
                    <Input
                      id="dislikes"
                      type="number"
                      min="0"
                      value={newComment.dislikes}
                      onChange={(e) => setNewComment({...newComment, dislikes: parseInt(e.target.value) || 0})}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <Label htmlFor="comment_text">Comentário</Label>
                  <Textarea
                    id="comment_text"
                    value={newComment.comment_text}
                    onChange={(e) => setNewComment({...newComment, comment_text: e.target.value})}
                    placeholder="Digite o comentário..."
                    rows={3}
                    className="mt-1"
                  />
                </div>
                <Button type="button" onClick={addComment}>
                  Adicionar Comentário
                </Button>
              </div>

              {/* Lista de comentários existentes */}
              {comments.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">Comentários existentes ({comments.length})</h4>
                  {comments.map((comment) => (
                    <div key={comment.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">{comment.author_name}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-lg ${
                                    i < comment.rating ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {comment.rating} estrela{comment.rating !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeComment(comment.id!)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-muted-foreground mb-3">{comment.comment_text}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            value={comment.likes}
                            onChange={(e) => updateComment(comment.id!, 'likes', parseInt(e.target.value) || 0)}
                            className="w-20"
                          />
                          <span className="text-sm text-muted-foreground">👍 curtidas</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            value={comment.dislikes}
                            onChange={(e) => updateComment(comment.id!, 'dislikes', parseInt(e.target.value) || 0)}
                            className="w-20"
                          />
                          <span className="text-sm text-muted-foreground">👎 não curtiu</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

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