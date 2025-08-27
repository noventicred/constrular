import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, Search, Folder, FolderOpen } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  created_at: string;
}

interface CategoryListProps {
  categories: Category[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export const CategoryList = ({ 
  categories, 
  searchTerm, 
  onSearchChange, 
  onEdit, 
  onDelete 
}: CategoryListProps) => {
  const getParentName = (parentId: string | null): string => {
    if (!parentId) return '';
    const parent = categories.find(cat => cat.id === parentId);
    return parent ? parent.name : '';
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
            onChange={(e) => onSearchChange(e.target.value)}
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
                      onClick={() => onEdit(category)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(category.id)}
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
  );
};