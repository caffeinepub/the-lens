import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../api/authHooks';
import {
  useAdminGetAllProducts,
  useAdminCreateProduct,
  useAdminUpdateProduct,
  useAdminSetProductPublishStatus,
} from '../api/adminProductHooks';
import { Product, Category } from '../backend';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Plus, Edit, Eye, EyeOff, Loader2 } from 'lucide-react';
import AccessDeniedScreen from '../components/feedback/AccessDeniedScreen';
import { Switch } from '../components/ui/switch';

type ProductFormData = {
  id: string;
  name: string;
  description: string;
  price: string;
  category: Category;
  stock: string;
  published: boolean;
};

export default function AdminProductsPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: products, isLoading: productsLoading, error: productsError } = useAdminGetAllProducts();
  const createProduct = useAdminCreateProduct();
  const updateProduct = useAdminUpdateProduct();
  const setPublishStatus = useAdminSetProductPublishStatus();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    id: '',
    name: '',
    description: '',
    price: '',
    category: Category.electronics,
    stock: '',
    published: true,
  });
  const [formError, setFormError] = useState<string>('');

  // Show loading while checking admin status
  if (!identity || isAdminLoading) {
    return (
      <div className="container-custom py-12">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        stock: product.stock.toString(),
        published: product.published,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        id: '',
        name: '',
        description: '',
        price: '',
        category: Category.electronics,
        stock: '',
        published: true,
      });
    }
    setFormError('');
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProduct(null);
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validation
    if (!formData.id.trim() || !formData.name.trim() || !formData.description.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }

    const price = parseInt(formData.price);
    const stock = parseInt(formData.stock);

    if (isNaN(price) || price < 0) {
      setFormError('Price must be a valid positive number.');
      return;
    }

    if (isNaN(stock) || stock < 0) {
      setFormError('Stock must be a valid positive number.');
      return;
    }

    const product: Product = {
      id: formData.id.trim(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: BigInt(price),
      category: formData.category,
      stock: BigInt(stock),
      published: formData.published,
    };

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync(product);
      } else {
        await createProduct.mutateAsync(product);
      }
      handleCloseDialog();
    } catch (error: any) {
      const errorMessage = error?.message || 'An error occurred';
      const lowerMessage = errorMessage.toLowerCase();
      
      if (lowerMessage.includes('unauthorized') || lowerMessage.includes('permission')) {
        setFormError('You do not have permission to perform this action.');
      } else if (lowerMessage.includes('already exists')) {
        setFormError('A product with this ID already exists.');
      } else {
        setFormError(errorMessage);
      }
    }
  };

  const handleTogglePublish = async (productId: string, currentStatus: boolean) => {
    try {
      await setPublishStatus.mutateAsync({ productId, published: !currentStatus });
    } catch (error: any) {
      const errorMessage = error?.message || 'An error occurred';
      const lowerMessage = errorMessage.toLowerCase();
      
      if (lowerMessage.includes('unauthorized') || lowerMessage.includes('permission')) {
        alert('You do not have permission to perform this action.');
      } else {
        alert(errorMessage);
      }
    }
  };

  const getCategoryLabel = (category: Category) => {
    return category === Category.electronics ? 'Electronics' : 'Home Decor';
  };

  // Determine error message for products loading
  const getProductsErrorMessage = () => {
    if (!productsError) return '';
    const message = productsError.message || '';
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('unauthorized') || lowerMessage.includes('permission')) {
      return 'You do not have permission to view products.';
    }
    return 'Failed to load products. Please try again.';
  };

  return (
    <div className="container-custom py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Product Management</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage product visibility on your storefront.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {productsError && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{getProductsErrorMessage()}</AlertDescription>
        </Alert>
      )}

      {productsLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : products && products.length > 0 ? (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-mono text-sm">{product.id}</TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{getCategoryLabel(product.category)}</TableCell>
                  <TableCell>${Number(product.price)}</TableCell>
                  <TableCell>{Number(product.stock)}</TableCell>
                  <TableCell>
                    <Badge variant={product.published ? 'default' : 'secondary'}>
                      {product.published ? 'Published' : 'Unpublished'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleTogglePublish(product.id, product.published)}
                        disabled={setPublishStatus.isPending}
                        title={product.published ? 'Unpublish' : 'Publish'}
                      >
                        {setPublishStatus.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : product.published ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(product)}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-lg border bg-card p-12 text-center">
          <p className="text-muted-foreground">No products found. Create your first product to get started.</p>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Create New Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct
                ? 'Update the product details below.'
                : 'Fill in the details to create a new product.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {formError && (
                <Alert variant="destructive">
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="id">Product ID *</Label>
                <Input
                  id="id"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  placeholder="e.g., prod4"
                  disabled={!!editingProduct}
                  required
                />
                {editingProduct && (
                  <p className="text-xs text-muted-foreground">Product ID cannot be changed.</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Wireless Headphones"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter product description"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock *</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value as Category })}
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Category.electronics}>Electronics</SelectItem>
                    <SelectItem value={Category.homeDecor}>Home Decor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
                <Label htmlFor="published" className="cursor-pointer">
                  Publish product (visible to customers)
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createProduct.isPending || updateProduct.isPending}
              >
                {(createProduct.isPending || updateProduct.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingProduct ? 'Update Product' : 'Create Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
