import { useState } from 'react';
import { Package } from 'lucide-react';
import { Card } from '../ui/card';
import { getProductImages } from '../../utils/productImages';

interface ProductImageGalleryProps {
  productId: string;
  productName: string;
}

export default function ProductImageGallery({ productId, productName }: ProductImageGalleryProps) {
  // Try to get images by ID first, then fall back to name
  let images = getProductImages(productId);
  if (images.length === 0) {
    images = getProductImages(productName);
  }

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Fallback to placeholder if no images or error
  if (images.length === 0 || imageError) {
    return (
      <Card className="overflow-hidden">
        <div className="aspect-square bg-muted flex items-center justify-center p-12">
          <div className="text-center">
            <Package className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium text-muted-foreground">{productName}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <Card className="overflow-hidden">
        <div className="aspect-square bg-muted flex items-center justify-center">
          <img
            src={images[selectedIndex]}
            alt={`${productName} - Image ${selectedIndex + 1}`}
            className="w-full h-full object-contain"
            onError={() => setImageError(true)}
          />
        </div>
      </Card>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedIndex(index);
                setImageError(false);
              }}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === index
                  ? 'border-accent shadow-md'
                  : 'border-border hover:border-accent/50'
              }`}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
