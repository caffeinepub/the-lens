import { useState, useEffect } from 'react';
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
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  // Reset state when product changes
  useEffect(() => {
    setSelectedIndex(0);
    setFailedImages(new Set());
  }, [productId, productName]);

  // Check if all images have failed
  const allImagesFailed = images.length > 0 && failedImages.size === images.length;

  // Fallback to placeholder if no images or all failed
  if (images.length === 0 || allImagesFailed) {
    return (
      <Card className="overflow-hidden">
        <div className="aspect-square bg-muted flex items-center justify-center p-12">
          <div className="text-center">
            <Package className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium text-muted-foreground">{productName}</p>
            {allImagesFailed && (
              <p className="text-sm text-muted-foreground mt-2">Images failed to load</p>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // Handle image load error
  const handleImageError = (index: number) => {
    setFailedImages(prev => {
      const newFailedImages = new Set(prev);
      newFailedImages.add(index);

      // If current image failed, try to select next available image
      if (index === selectedIndex) {
        const nextValidIndex = images.findIndex((_, i) => !newFailedImages.has(i));
        if (nextValidIndex !== -1 && nextValidIndex !== selectedIndex) {
          setSelectedIndex(nextValidIndex);
        }
      }

      return newFailedImages;
    });
  };

  // Check if current selected image has failed
  const currentImageFailed = failedImages.has(selectedIndex);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <Card className="overflow-hidden">
        <div className="aspect-square bg-muted flex items-center justify-center">
          {currentImageFailed ? (
            <div className="text-center p-12">
              <Package className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium text-muted-foreground">{productName}</p>
              <p className="text-sm text-muted-foreground mt-2">Image failed to load</p>
            </div>
          ) : (
            <img
              src={images[selectedIndex]}
              alt={`${productName} - Image ${selectedIndex + 1}`}
              className="w-full h-full object-contain"
              onError={() => handleImageError(selectedIndex)}
            />
          )}
        </div>
      </Card>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => !failedImages.has(index) && setSelectedIndex(index)}
              disabled={failedImages.has(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === index
                  ? 'border-accent shadow-md'
                  : failedImages.has(index)
                  ? 'border-border opacity-50 cursor-not-allowed'
                  : 'border-border hover:border-accent/50'
              }`}
            >
              {failedImages.has(index) ? (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Package className="h-6 w-6 text-muted-foreground" />
                </div>
              ) : (
                <img
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(index)}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
