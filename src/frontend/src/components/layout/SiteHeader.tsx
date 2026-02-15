import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../store/CartProvider';
import { Button } from '../ui/button';
import { getContent } from '../../content/siteContent';
import { useIsCallerAdmin } from '../../api/authHooks';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

export default function SiteHeader() {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const content = getContent();
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();

  const showAdminLink = !!identity && isAdmin;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/assets/generated/the-lens-logo.dim_512x512.png"
              alt={content.brand.name}
              className="h-10 w-10 object-contain"
            />
            <span className="text-xl font-bold tracking-tight">{content.brand.name}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:text-accent"
              activeProps={{ className: 'text-accent' }}
            >
              {content.nav.home}
            </Link>
            <Link
              to="/shop"
              className="text-sm font-medium transition-colors hover:text-accent"
              activeProps={{ className: 'text-accent' }}
            >
              {content.nav.shop}
            </Link>
            <Link
              to="/category/$categoryId"
              params={{ categoryId: 'electronics' }}
              className="text-sm font-medium transition-colors hover:text-accent"
            >
              {content.nav.electronics}
            </Link>
            <Link
              to="/category/$categoryId"
              params={{ categoryId: 'homeDecor' }}
              className="text-sm font-medium transition-colors hover:text-accent"
            >
              {content.nav.homeDecor}
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium transition-colors hover:text-accent"
              activeProps={{ className: 'text-accent' }}
            >
              {content.nav.about}
            </Link>
            {showAdminLink && (
              <Link
                to="/admin/products"
                className="text-sm font-medium transition-colors hover:text-accent"
                activeProps={{ className: 'text-accent' }}
              >
                {content.nav.admin}
              </Link>
            )}
          </nav>

          {/* Cart Button */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate({ to: '/cart' })}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                  {itemCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t py-4 space-y-3">
            <Link
              to="/"
              className="block text-sm font-medium transition-colors hover:text-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              {content.nav.home}
            </Link>
            <Link
              to="/shop"
              className="block text-sm font-medium transition-colors hover:text-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              {content.nav.shop}
            </Link>
            <Link
              to="/category/$categoryId"
              params={{ categoryId: 'electronics' }}
              className="block text-sm font-medium transition-colors hover:text-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              {content.nav.electronics}
            </Link>
            <Link
              to="/category/$categoryId"
              params={{ categoryId: 'homeDecor' }}
              className="block text-sm font-medium transition-colors hover:text-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              {content.nav.homeDecor}
            </Link>
            <Link
              to="/about"
              className="block text-sm font-medium transition-colors hover:text-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              {content.nav.about}
            </Link>
            {showAdminLink && (
              <Link
                to="/admin/products"
                className="block text-sm font-medium transition-colors hover:text-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                {content.nav.admin}
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
