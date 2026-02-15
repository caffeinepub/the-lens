import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useGetAllProducts, useInitializeShop } from '../api/shopHooks';
import ProductGrid from '../components/products/ProductGrid';
import AsyncState, { LoadingSpinner } from '../components/feedback/AsyncState';
import { getContent } from '../content/siteContent';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: products, isLoading, isError, error } = useGetAllProducts();
  const initShop = useInitializeShop();
  const content = getContent();

  useEffect(() => {
    if (!isLoading && products && products.length === 0 && !initShop.isPending) {
      initShop.mutate();
    }
  }, [products, isLoading, initShop]);

  const featuredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    
    // Prioritize CMF earbuds if it exists in the published products
    const cmfEarbuds = products.find(p => p.id === 'cmf-earbuds');
    const otherProducts = products.filter(p => p.id !== 'cmf-earbuds');
    
    if (cmfEarbuds) {
      // Include CMF earbuds first, then fill with other products up to 4 total
      return [cmfEarbuds, ...otherProducts].slice(0, 4);
    }
    
    // If CMF earbuds doesn't exist, just take first 4 products
    return products.slice(0, 4);
  }, [products]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container-custom py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
                <Sparkles className="h-4 w-4" />
                {content.home.hero.badge}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                {content.home.hero.title}
                <span className="block text-accent">{content.home.hero.titleAccent}</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                {content.home.hero.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => navigate({ to: '/shop' })}>
                  {content.home.hero.ctaPrimary}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate({ to: '/about' })}>
                  {content.home.hero.ctaSecondary}
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/the-lens-hero.dim_1600x600.png"
                alt={content.home.hero.imageAlt}
                className="rounded-lg shadow-medium w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">{content.home.categories.heading}</h2>
            <p className="text-muted-foreground">{content.home.categories.subheading}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link to="/category/$categoryId" params={{ categoryId: 'electronics' }}>
              <Card className="group overflow-hidden transition-all hover:shadow-medium cursor-pointer">
                <div className="aspect-video overflow-hidden">
                  <img
                    src="/assets/generated/the-lens-category-electronics.dim_800x800.png"
                    alt={content.home.categories.electronics.imageAlt}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-2">
                    {content.home.categories.electronics.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {content.home.categories.electronics.description}
                  </p>
                  <Button variant="ghost" className="group-hover:text-accent">
                    {content.home.categories.electronics.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link to="/category/$categoryId" params={{ categoryId: 'homeDecor' }}>
              <Card className="group overflow-hidden transition-all hover:shadow-medium cursor-pointer">
                <div className="aspect-video overflow-hidden">
                  <img
                    src="/assets/generated/the-lens-category-home-decor.dim_800x800.png"
                    alt={content.home.categories.homeDecor.imageAlt}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-2">
                    {content.home.categories.homeDecor.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {content.home.categories.homeDecor.description}
                  </p>
                  <Button variant="ghost" className="group-hover:text-accent">
                    {content.home.categories.homeDecor.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">{content.home.featured.heading}</h2>
            <p className="text-muted-foreground">{content.home.featured.subheading}</p>
          </div>

          {initShop.isPending ? (
            <LoadingSpinner message={content.home.featured.setupMessage} />
          ) : (
            <AsyncState
              isLoading={isLoading}
              isError={isError}
              error={error}
              isEmpty={featuredProducts.length === 0}
              emptyMessage={content.home.featured.emptyMessage}
            >
              <ProductGrid products={featuredProducts} />
              {featuredProducts.length > 0 && (
                <div className="text-center mt-12">
                  <Button size="lg" variant="outline" onClick={() => navigate({ to: '/shop' })}>
                    {content.home.featured.viewAllCta}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              )}
            </AsyncState>
          )}
        </div>
      </section>
    </div>
  );
}
