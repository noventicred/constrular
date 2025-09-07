import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Image as ImageIcon, 
  Package,
  DollarSign,
  Star,
  Camera,
  Save,
  Eye,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

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
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<Comment>({
    author_name: '',
    comment_text: '',
    rating: 5,
    likes: 0,
    dislikes: 0,
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
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as categorias.',
        variant: 'destructive',
      });
    }
  };

  const getCorrectImageUrl = async (imagePath: string): Promise<string> => {
    const trimmedPath = imagePath.trim();
    
    // Se já é uma URL completa, retorna ela
    if (trimmedPath.startsWith('http')) {
      return trimmedPath;
    }
    
    // Se parece com um caminho do storage, constrói a URL
    try {
      const { data: publicUrl } = supabase.storage
        .from('product-images')
        .getPublicUrl(trimmedPath);
      
      // Verificar se a URL é válida fazendo uma requisição HEAD
      const response = await fetch(publicUrl.publicUrl, { method: 'HEAD' });
      if (response.ok) {
        return publicUrl.publicUrl;
      } else {
        console.warn('Image not accessible:', publicUrl.publicUrl);
        return ''; // Retorna string vazia para indicar erro
      }
    } catch (error) {
      console.error('Error constructing image URL:', error);
      return '';
    }
  };

  const fetchProduct = async () => {
    if (!id) return;

    setLoading(true);
    try {
      // Buscar dados do produto e comentários em paralelo
      const [productResult, commentsResult] = await Promise.all([
        supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single(),
        supabase
          .from('product_comments')
          .select('*')
          .eq('product_id', id)
          .order('created_at', { ascending: false })
      ]);

      if (productResult.error) throw productResult.error;

      const data = productResult.data;
      setFormData({
        name: data.name || '',
        description: data.description || '',
        price: data.price?.toString() || '',
        original_price: data.original_price?.toString() || '',
        discount: data.discount?.toString() || '',
        category_id: data.category_id || '',
        sku: data.sku || '',
        in_stock: data.in_stock ?? true,
        is_featured: data.is_featured ?? false,
        is_special_offer: data.is_special_offer ?? false,
      });

      // Carregar imagens existentes com URLs corretas
      if (data.image_url) {
        const images = data.image_url.split(',').filter(Boolean);
        console.log('Raw images from DB:', images);
        
        // Processar cada imagem de forma assíncrona
        const imagePromises = images.map(async (img) => {
          const correctedUrl = await getCorrectImageUrl(img);
          return correctedUrl;
        });
        
        const correctedImages = await Promise.all(imagePromises);
        // Filtrar URLs vazias (imagens que falharam)
        const validImages = correctedImages.filter(url => url !== '');
        
        console.log('Final corrected images:', validImages);
        setExistingImages(validImages);
      }

      // Carregar comentários existentes
      if (commentsResult.data) {
        const existingComments = commentsResult.data.map(comment => ({
          id: comment.id,
          author_name: comment.author_name || 'Cliente',
          comment_text: comment.comment_text || '',
          rating: comment.rating || 5,
          likes: comment.likes || 0,
          dislikes: comment.dislikes || 0,
        }));
        setComments(existingComments);
      }

    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar o produto.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    // Validar tamanho e tipo
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Arquivo muito grande',
          description: `${file.name} excede 5MB`,
          variant: 'destructive',
        });
        return false;
      }
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Tipo inválido',
          description: `${file.name} não é uma imagem`,
          variant: 'destructive',
        });
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setImageFiles(prev => [...prev, ...validFiles]);

    // Criar previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number, isExisting: boolean = false) => {
    if (isExisting) {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setImageFiles(prev => prev.filter((_, i) => i !== index));
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    
    if (!formData.name || !formData.price || !formData.category_id) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha nome, preço e categoria.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Upload das imagens primeiro
      let imageUrls: string[] = [...existingImages];
      
      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          
          const { data, error } = await supabase.storage
            .from('product-images')
            .upload(fileName, file);

          if (error) throw error;
          
          const { data: publicUrl } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);
            
          return publicUrl.publicUrl;
        });

        const uploadedUrls = await Promise.all(uploadPromises);
        imageUrls = [...imageUrls, ...uploadedUrls];
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        discount: formData.discount ? parseInt(formData.discount) : 0,
        category_id: formData.category_id,
        sku: formData.sku,
        in_stock: formData.in_stock,
        is_featured: formData.is_featured,
        is_special_offer: formData.is_special_offer,
        image_url: imageUrls.join(','),
      };

      if (isEditing) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', id);

        if (error) throw error;

        toast({
          title: '✅ Produto atualizado!',
          description: 'As alterações foram salvas com sucesso.',
        });
      } else {
        const { data: newProduct, error } = await supabase
          .from('products')
          .insert([productData])
          .select()
          .single();

        if (error) throw error;

        // Salvar comentários se existirem
        if (comments.length > 0 && newProduct) {
          const commentsToInsert = comments.map(comment => ({
            product_id: newProduct.id,
            author_name: comment.author_name,
            comment_text: comment.comment_text,
            rating: comment.rating,
            likes: comment.likes,
            dislikes: comment.dislikes,
          }));

          const { error: commentsError } = await supabase
            .from('product_comments')
            .insert(commentsToInsert);

          if (commentsError) {
            console.error('Error saving comments:', commentsError);
            // Não bloquear o sucesso do produto por erro nos comentários
          }
        }

        toast({
          title: '✅ Produto criado!',
          description: 'Novo produto adicionado ao catálogo.',
        });
      }

      navigate('/admin/produtos');
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar o produto.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscount = () => {
    if (formData.price && formData.original_price) {
      const price = parseFloat(formData.price);
      const originalPrice = parseFloat(formData.original_price);
      if (originalPrice > price) {
        const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
        setFormData(prev => ({ ...prev, discount: discount.toString() }));
      }
    }
  };

  const addComment = async () => {
    if (!newComment.author_name || !newComment.comment_text) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha o nome do autor e o comentário.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (isEditing && id) {
        // Salvar comentário no banco de dados
        const { data, error } = await supabase
          .from('product_comments')
          .insert([{
            product_id: id,
            author_name: newComment.author_name,
            comment_text: newComment.comment_text,
            rating: newComment.rating,
            likes: newComment.likes,
            dislikes: newComment.dislikes,
          }])
          .select()
          .single();

        if (error) throw error;

        // Adicionar ao estado local
        setComments(prev => [
          {
            id: data.id,
            author_name: data.author_name,
            comment_text: data.comment_text,
            rating: data.rating,
            likes: data.likes,
            dislikes: data.dislikes,
          },
          ...prev
        ]);

        toast({
          title: '✅ Comentário salvo!',
          description: 'Comentário adicionado ao produto com sucesso.',
        });
      } else {
        // Para produtos novos, apenas adicionar ao estado local
        setComments(prev => [
          { ...newComment, id: Date.now().toString() },
          ...prev
        ]);

        toast({
          title: '✅ Comentário adicionado!',
          description: 'Comentário será salvo quando o produto for criado.',
        });
      }

      // Limpar formulário
      setNewComment({
        author_name: '',
        comment_text: '',
        rating: 5,
        likes: 0,
        dislikes: 0,
      });

    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Erro ao salvar comentário',
        description: 'Não foi possível salvar o comentário.',
        variant: 'destructive',
      });
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      if (commentId.length > 10) { // ID do banco (UUID)
        const { error } = await supabase
          .from('product_comments')
          .delete()
          .eq('id', commentId);

        if (error) throw error;

        toast({
          title: '✅ Comentário excluído!',
          description: 'Comentário removido com sucesso.',
        });
      }

      // Remover do estado local
      setComments(prev => prev.filter(comment => comment.id !== commentId));

    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: 'Erro ao excluir comentário',
        description: 'Não foi possível excluir o comentário.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    calculateDiscount();
  }, [formData.price, formData.original_price]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/produtos')}
            className="h-10 w-10 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Editar Produto' : 'Novo Produto'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditing ? 'Atualize as informações do produto' : 'Adicione um novo produto ao catálogo'}
            </p>
          </div>
        </div>

        <div className="space-y-8">
            <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Informações Básicas</CardTitle>
                  <CardDescription>Dados principais do produto</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                    Nome do Produto *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Cimento CP II-E-32 50kg"
                    className="h-12 border-2 border-gray-200 focus:border-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku" className="text-sm font-semibold text-gray-700">
                    SKU / Código
                  </Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                    placeholder="Ex: CIM001"
                    className="h-12 border-2 border-gray-200 focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-semibold text-gray-700">
                  Categoria *
                </Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                  required
                >
                  <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-primary">
                    <SelectValue placeholder="Selecione uma categoria" />
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

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                  Descrição do Produto
                </Label>
                <div className="space-y-2">
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descreva detalhadamente as características, benefícios e especificações do produto...&#10;&#10;Use quebras de linha para organizar melhor a informação:&#10;• Características principais&#10;• Benefícios para o cliente&#10;• Especificações técnicas&#10;• Forma de uso&#10;• Garantia e cuidados"
                    className="min-h-48 border-2 border-gray-200 focus:border-primary resize-y"
                    rows={12}
                  />
                  <p className="text-xs text-gray-500">
                    💡 Dica: Use quebras de linha e bullet points (•) para organizar melhor a informação
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preços e Desconto */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Preços e Promoções</CardTitle>
                  <CardDescription>Configure valores e descontos</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-semibold text-gray-700">
                    Preço Atual * (R$)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0,00"
                    className="h-12 border-2 border-gray-200 focus:border-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="original_price" className="text-sm font-semibold text-gray-700">
                    Preço Original (R$)
                  </Label>
                  <Input
                    id="original_price"
                    type="number"
                    step="0.01"
                    value={formData.original_price}
                    onChange={(e) => setFormData(prev => ({ ...prev, original_price: e.target.value }))}
                    placeholder="0,00"
                    className="h-12 border-2 border-gray-200 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount" className="text-sm font-semibold text-gray-700">
                    Desconto (%)
                  </Label>
                  <div className="relative">
                    <Input
                      id="discount"
                      type="number"
                      value={formData.discount}
                      onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
                      placeholder="0"
                      className="h-12 border-2 border-gray-200 focus:border-primary"
                      readOnly
                    />
                    {formData.discount && parseInt(formData.discount) > 0 && (
                      <Badge className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-500 text-white">
                        -{formData.discount}%
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Preview de Preços */}
              {formData.price && (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-3">Preview dos Preços:</h4>
                  <div className="flex items-center gap-4">
                    {formData.original_price && parseFloat(formData.original_price) > parseFloat(formData.price) && (
                      <span className="text-sm text-gray-500 line-through">
                        De: R$ {parseFloat(formData.original_price).toFixed(2).replace('.', ',')}
                      </span>
                    )}
                    <span className="text-2xl font-bold text-blue-600">
                      R$ {parseFloat(formData.price).toFixed(2).replace('.', ',')}
                    </span>
                    {formData.discount && parseInt(formData.discount) > 0 && (
                      <Badge className="bg-blue-500 text-white">
                        PIX -{formData.discount}%
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Imagens */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Camera className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Imagens do Produto</CardTitle>
                  <CardDescription>Adicione fotos para destacar seu produto</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-700">Clique para adicionar imagens</p>
                      <p className="text-sm text-gray-500">ou arraste e solte aqui</p>
                      <p className="text-xs text-gray-400 mt-2">PNG, JPG até 5MB cada</p>
                    </div>
                  </div>
                </label>
              </div>

              {/* Image Previews */}
              {(existingImages.length > 0 || imagePreviews.length > 0) && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Imagens do Produto:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Existing Images */}
                    {existingImages.map((url, index) => (
                      <div key={`existing-${index}`} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                          <img
                            src={url}
                            alt={`Imagem ${index + 1}`}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              console.error('Image failed to load:', url);
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              
                              // Criar elemento de fallback
                              const fallback = document.createElement('div');
                              fallback.className = 'w-full h-full flex items-center justify-center bg-gray-200 text-gray-500';
                              fallback.innerHTML = `
                                <div class="text-center">
                                  <svg class="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                  </svg>
                                  <p class="text-xs">Erro ao carregar</p>
                                </div>
                              `;
                              target.parentNode?.appendChild(fallback);
                            }}
                            onLoad={() => {
                              console.log('Image loaded successfully:', url);
                            }}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index, true)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <Badge className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs">
                          Existente
                        </Badge>
                      </div>
                    ))}

                    {/* New Images */}
                    {imagePreviews.map((preview, index) => (
                      <div key={`new-${index}`} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-green-200">
                          <img
                            src={preview}
                            alt={`Nova imagem ${index + 1}`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index, false)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <Badge className="absolute bottom-2 left-2 bg-green-500 text-white text-xs">
                          Nova
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Configurações */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Configurações</CardTitle>
                  <CardDescription>Status e destacamentos do produto</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="space-y-1">
                    <Label htmlFor="in_stock" className="text-sm font-semibold text-gray-700">
                      Em Estoque
                    </Label>
                    <p className="text-xs text-gray-500">Produto disponível para venda</p>
                  </div>
                  <Switch
                    id="in_stock"
                    checked={formData.in_stock}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, in_stock: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="space-y-1">
                    <Label htmlFor="is_featured" className="text-sm font-semibold text-gray-700">
                      Produto Destaque
                    </Label>
                    <p className="text-xs text-gray-500">Aparece na página inicial</p>
                  </div>
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                  <div className="space-y-1">
                    <Label htmlFor="is_special_offer" className="text-sm font-semibold text-gray-700">
                      Oferta Especial
                    </Label>
                    <p className="text-xs text-gray-500">Aparece em promoções</p>
                  </div>
                  <Switch
                    id="is_special_offer"
                    checked={formData.is_special_offer}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_special_offer: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
            {/* Comentários do Produto */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Comentários e Avaliações</CardTitle>
                    <CardDescription>Gerencie feedback dos clientes</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Adicionar Novo Comentário */}
                <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h4 className="font-semibold text-gray-800">Adicionar Comentário de Teste</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Nome do Cliente</Label>
                      <Input
                        value={newComment.author_name}
                        onChange={(e) => setNewComment(prev => ({ ...prev, author_name: e.target.value }))}
                        placeholder="João Silva"
                        className="border-2 border-gray-200 focus:border-primary"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Avaliação</Label>
                      <Select
                        value={newComment.rating.toString()}
                        onValueChange={(value) => setNewComment(prev => ({ ...prev, rating: parseInt(value) }))}
                      >
                        <SelectTrigger className="border-2 border-gray-200 focus:border-primary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <SelectItem key={rating} value={rating.toString()}>
                              <div className="flex items-center gap-2">
                                <span>{rating}</span>
                                <div className="flex">
                                  {[...Array(rating)].map((_, i) => (
                                    <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                                  ))}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Comentário</Label>
                    <Textarea
                      value={newComment.comment_text}
                      onChange={(e) => setNewComment(prev => ({ ...prev, comment_text: e.target.value }))}
                      placeholder="Produto de excelente qualidade, entrega rápida..."
                      className="border-2 border-gray-200 focus:border-primary resize-none"
                      rows={3}
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={addComment}
                    className="w-full bg-blue-500 hover:bg-blue-600"
                    disabled={loading}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    {isEditing ? 'Salvar Comentário' : 'Adicionar Comentário'}
                  </Button>
                </div>

                {/* Lista de Comentários */}
                {comments.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">Comentários ({comments.length})</h4>
                    <div className="max-h-96 overflow-y-auto space-y-3">
                      {comments.map((comment, index) => (
                        <div key={comment.id || index} className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-gray-800">{comment.author_name}</p>
                              <div className="flex items-center gap-1">
                                {[...Array(comment.rating)].map((_, i) => (
                                  <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                                ))}
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => comment.id && deleteComment(comment.id)}
                              className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{comment.comment_text}</p>
                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                            <span>👍 {comment.likes}</span>
                            <span>👎 {comment.dislikes}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/produtos')}
              className="h-12 px-8 font-semibold border-2"
            >
              Cancelar
            </Button>
            
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="h-12 px-8 font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg flex-1 sm:flex-none"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {isEditing ? 'Atualizando...' : 'Criando...'}
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  {isEditing ? 'Atualizar Produto' : 'Criar Produto'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;