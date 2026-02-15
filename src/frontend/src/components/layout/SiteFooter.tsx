import { Heart } from 'lucide-react';
import { getContent } from '../../content/siteContent';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'the-lens'
  );
  const content = getContent();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold mb-3">{content.brand.name}</h3>
            <p className="text-sm text-muted-foreground">{content.footer.brandBlurb}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-3">{content.footer.quickLinksHeading}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/shop" className="hover:text-accent transition-colors">
                  {content.nav.shop}
                </a>
              </li>
              <li>
                <a href="/category/electronics" className="hover:text-accent transition-colors">
                  {content.nav.electronics}
                </a>
              </li>
              <li>
                <a href="/category/homeDecor" className="hover:text-accent transition-colors">
                  {content.nav.homeDecor}
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-accent transition-colors">
                  {content.nav.about}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold mb-3">{content.contact.heading}</h4>
            <p className="text-sm text-muted-foreground">{content.footer.contactBlurb}</p>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>{content.footer.copyrightTemplate.replace('{year}', currentYear.toString())}</p>
          <p className="mt-2 flex items-center justify-center gap-1">
            Built with <Heart className="h-4 w-4 text-accent fill-accent" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-accent transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
