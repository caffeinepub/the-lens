import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useGetAllProducts, useInitializeShop } from '../api/shopHooks';
import { useIsCallerAdmin } from '../api/authHooks';
import ProductGrid from '../components/products/ProductGrid';
import AsyncState from '../components/feedback/AsyncState';
import { getContent } from '../content/siteContent';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: products, isLoading, isError, error } = useGetAllProducts();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const initShop = useInitializeShop();
  const content = getContent();

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

  // Admin-aware empty state for featured products
  const renderEmptyState = () => {
    // Show loading while checking admin status
    if (isAdminLoading) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      );
    }

    // Admin sees initialization option
    if (isAdmin) {
      return (
        <div className="text-center py-12 space-y-4">
          <p className="text-muted-foreground mb-4">
            No products available. Initialize the shop to add sample products.
          </p>
          <Button
            onClick={() => initShop.mutate()}
            disabled={initShop.isPending}
            size="lg"
          >
            {initShop.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing Shop...
              </>
            ) : (
              'Initialize Shop'
            )}
          </Button>
          {initShop.isError && (
            <Alert variant="destructive" className="mt-4 max-w-md mx-auto">
              <AlertDescription>
                Failed to initialize shop. Please try again or check your permissions.
              </AlertDescription>
            </Alert>
          )}
        </div>
      );
    }

    // Non-admin sees friendly empty message
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No products available at the moment. Please check back soon!
        </p>
      </div>
    );
  };

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

          <AsyncState
            isLoading={isLoading}
            isError={isError}
            error={error}
            isEmpty={featuredProducts.length === 0}
            emptyContent={renderEmptyState()}
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
        </div>
      </section>
    </div>
  );
}
