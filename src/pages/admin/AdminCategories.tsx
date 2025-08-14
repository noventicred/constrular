import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import { CategoryList } from '@/components/admin/CategoryList';
import { CategoryForm } from '@/components/admin/CategoryForm';

interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  created_at: string;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
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

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setActiveTab('form');
  };

  const handleNew = () => {
    console.log('handleNew called - setting activeTab to form');
    setEditingCategory(null);
    setActiveTab('form');
    console.log('activeTab set to:', 'form');
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

  const handleSave = () => {
    setActiveTab('list');
    setEditingCategory(null);
    fetchCategories();
  };

  const handleCancel = () => {
    setActiveTab('list');
    setEditingCategory(null);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categorias</h1>
          <p className="text-muted-foreground">Gerencie as categorias dos produtos</p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => {
        console.log('Tab changing to:', value);
        setActiveTab(value);
      }}>
        <TabsList>
          <TabsTrigger value="list">Lista de Categorias</TabsTrigger>
          <TabsTrigger value="form">
            {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <CategoryList
            categories={categories}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="form">
          <div>
            <p>Form tab is active - activeTab: {activeTab}</p>
            <CategoryForm
              categories={categories}
              editingCategory={editingCategory}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCategories;