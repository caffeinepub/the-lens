import { useParams, useNavigate } from '@tanstack/react-router';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useGetProduct } from '../api/shopHooks';
import { useCart } from '../store/CartProvider';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import AsyncState from '../components/feedback/AsyncState';
import ProductImageGallery from '../components/products/ProductImageGallery';
import ProductDescription from '../components/products/ProductDescription';
import { formatINR } from '../utils/currency';

export default function ProductDetailPage() {
  const { productId } = useParams({ from: '/product/$productId' });
  const navigate = useNavigate();
  const { data: product, isLoading, isError, error } = useGetProduct(productId);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    if (!product) return;
    setIsAdding(true);
    addToCart(product, quantity);
    setTimeout(() => {
      setIsAdding(false);
      navigate({ to: '/cart' });
    }, 300);
  };

  const categoryName = product?.category === 'electronics' ? 'Electronics' : 'Home Decor';

  return (
    <div className="py-12">
      <div className="container-custom">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/shop' })}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Button>

        <AsyncState
          isLoading={isLoading}
          isError={isError}
          error={error}
          isEmpty={!product}
          emptyMessage="Product not found."
          skeletonCount={1}
        >
          {product && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Image Gallery */}
              <div>
                <ProductImageGallery productId={product.id} productName={product.name} />
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div>
                  <Badge variant="secondary" className="mb-3">
                    {categoryName}
                  </Badge>
                  <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                  <p className="text-3xl font-bold text-accent mb-6">{formatINR(product.price)}</p>
                  <ProductDescription description={product.description} />
                </div>

                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Availability:</span>
                      <span
                        className={`text-sm font-semibold ${
                          Number(product.stock) > 0 ? 'text-green-600' : 'text-destructive'
                        }`}
                      >
                        {Number(product.stock) > 0
                          ? `${Number(product.stock)} in stock`
                          : 'Out of stock'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        max={Number(product.stock)}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        disabled={Number(product.stock) === 0}
                      />
                    </div>

                    <Button
                      onClick={handleAddToCart}
                      disabled={Number(product.stock) === 0 || isAdding}
                      className="w-full"
                      size="lg"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      {isAdding ? 'Adding...' : 'Add to Cart'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </AsyncState>
      </div>
    </div>
  );
}
