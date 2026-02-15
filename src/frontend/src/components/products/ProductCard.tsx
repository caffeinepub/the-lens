import { Link } from '@tanstack/react-router';
import { ShoppingCart, Package } from 'lucide-react';
import { useState } from 'react';
import { Product } from '../../backend';
import { useCart } from '../../store/CartProvider';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';
import { getPrimaryProductImage } from '../../utils/productImages';
import { formatINR } from '../../utils/currency';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);
  
  // Try to get primary image by ID first, then fall back to name
  let primaryImage = getPrimaryProductImage(product.id);
  if (!primaryImage) {
    primaryImage = getPrimaryProductImage(product.name);
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  return (
    <Link to="/product/$productId" params={{ productId: product.id }}>
      <Card className="group h-full overflow-hidden transition-all hover:shadow-medium">
        <div className="aspect-square overflow-hidden bg-muted">
          {primaryImage && !imageError ? (
            <img
              src={primaryImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center p-8">
              <div className="text-center">
                <Package className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground line-clamp-2">
                  {product.name}
                </p>
              </div>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-base line-clamp-2 mb-2">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-accent">{formatINR(product.price)}</span>
            <span className="text-xs text-muted-foreground">
              {Number(product.stock)} in stock
            </span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            className="w-full"
            size="sm"
            disabled={Number(product.stock) === 0}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
