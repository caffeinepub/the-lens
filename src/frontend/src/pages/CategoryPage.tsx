import { useParams } from '@tanstack/react-router';
import { useGetProductsByCategory } from '../api/shopHooks';
import ProductGrid from '../components/products/ProductGrid';
import AsyncState from '../components/feedback/AsyncState';
import { Category } from '../backend';

export default function CategoryPage() {
  const { categoryId } = useParams({ from: '/category/$categoryId' });
  const category = categoryId as Category;

  const { data: products, isLoading, isError, error, refetch } = useGetProductsByCategory(category);

  const categoryName = category === 'electronics' ? 'Electronics' : 'Home Decor';

  return (
    <div className="py-12">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">{categoryName}</h1>
          <p className="text-muted-foreground">
            {category === 'electronics'
              ? 'Discover the latest gadgets and tech essentials'
              : 'Transform your space with our curated home decor collection'}
          </p>
        </div>

        <AsyncState
          isLoading={isLoading}
          isError={isError}
          error={error}
          isEmpty={!products || products.length === 0}
          emptyMessage={`No ${categoryName.toLowerCase()} products available.`}
          onRetry={() => refetch()}
          skeletonCount={8}
        >
          <ProductGrid products={products || []} />
        </AsyncState>
      </div>
    </div>
  );
}
