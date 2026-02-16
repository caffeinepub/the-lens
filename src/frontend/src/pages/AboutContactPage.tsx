import { Mail, Heart } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { getContent } from '../content/siteContent';

export default function AboutContactPage() {
  const content = getContent();

  return (
    <div className="py-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* About Section */}
          <section className="mb-16">
            <h1 className="text-4xl font-bold mb-6">{content.about.heading}</h1>
            <div className="prose prose-lg max-w-none">
              {content.about.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
            
            {/* Built with caffeine.ai and CEO Credit */}
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">
                Built with <Heart className="inline h-4 w-4 text-accent" /> using{' '}
                <a
                  href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  caffeine.ai
                </a>
              </p>
              <p className="text-sm font-semibold text-foreground">
                {content.about.ceoCreditLine}
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section>
            <h2 className="text-3xl font-bold mb-6">{content.contact.heading}</h2>
            <p className="text-muted-foreground mb-8">{content.contact.intro}</p>

            <div className="flex justify-center">
              <Card className="w-full max-w-sm">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-4">
                    <Mail className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">{content.contact.email.label}</h3>
                  <p className="text-sm text-muted-foreground">{content.contact.email.value}</p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
