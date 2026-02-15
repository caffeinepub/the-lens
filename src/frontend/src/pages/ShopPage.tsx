import { useState, useMemo } from 'react';
import { useGetAllProducts } from '../api/shopHooks';
import ProductGrid from '../components/products/ProductGrid';
import ProductSearchBar from '../components/products/ProductSearchBar';
import AsyncState from '../components/feedback/AsyncState';
import { Category } from '../backend';

export default function ShopPage() {
  const { data: products, isLoading, isError, error, refetch } = useGetAllProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="py-12">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Shop All Products</h1>
          <p className="text-muted-foreground">Browse our complete collection</p>
        </div>

        <ProductSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <AsyncState
          isLoading={isLoading}
          isError={isError}
          error={error}
          isEmpty={filteredProducts.length === 0}
          emptyMessage={
            searchQuery || selectedCategory !== 'all'
              ? 'No products match your filters.'
              : 'No products available.'
          }
          onRetry={() => refetch()}
          skeletonCount={8}
        >
          <ProductGrid products={filteredProducts} />
        </AsyncState>
      </div>
    </div>
  );
}
