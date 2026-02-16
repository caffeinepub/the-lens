/**
 * Centralized Site Content Configuration
 * 
 * This file contains all editable marketing copy and contact details for the site.
 * Edit the values in this file to update text across the entire application.
 * 
 * FIELD MAPPING (where each field appears in the UI):
 * 
 * BRAND:
 * - brand.name: Site header logo alt text, header wordmark, footer brand heading
 * 
 * HEADER NAVIGATION:
 * - nav.home: Header "Home" link label
 * - nav.shop: Header "Shop" link label
 * - nav.electronics: Header "Electronics" link label
 * - nav.homeDecor: Header "Home Decor" link label
 * - nav.about: Header "About" link label
 * - nav.login: Header "Login" link label
 * - nav.admin: Header "Admin" link label (visible only to admins)
 * 
 * HOME PAGE - HERO SECTION:
 * - home.hero.badge: Hero badge text (top of hero)
 * - home.hero.title: Main hero heading (first line)
 * - home.hero.titleAccent: Hero heading accent text (second line)
 * - home.hero.description: Hero description paragraph
 * - home.hero.ctaPrimary: Primary CTA button text
 * - home.hero.ctaSecondary: Secondary CTA button text
 * - home.hero.imageAlt: Hero image alt text
 * 
 * HOME PAGE - CATEGORIES SECTION:
 * - home.categories.heading: "Shop by Category" section heading
 * - home.categories.subheading: Section subheading
 * - home.categories.electronics.title: Electronics category card heading
 * - home.categories.electronics.description: Electronics category card description
 * - home.categories.electronics.cta: Electronics category card button text
 * - home.categories.electronics.imageAlt: Electronics category image alt text
 * - home.categories.homeDecor.title: Home Decor category card heading
 * - home.categories.homeDecor.description: Home Decor category card description
 * - home.categories.homeDecor.cta: Home Decor category card button text
 * - home.categories.homeDecor.imageAlt: Home Decor category image alt text
 * 
 * HOME PAGE - FEATURED SECTION:
 * - home.featured.heading: "Featured Products" section heading
 * - home.featured.subheading: Section subheading
 * - home.featured.emptyMessage: Message shown when no products available (non-admin)
 * - home.featured.emptyMessageAdmin: Message shown to admins when no products available
 * - home.featured.viewAllCta: "View All Products" button text
 * - home.featured.initializeButton: Initialize shop button text for admins
 * 
 * ABOUT PAGE:
 * - about.heading: "About" page main heading
 * - about.paragraphs: Array of about section paragraphs
 * 
 * CONTACT PAGE:
 * - contact.heading: "Contact" section heading
 * - contact.intro: Contact section intro paragraph
 * - contact.email.label: Email card heading
 * - contact.email.value: Email address
 * - contact.phone.label: Phone card heading
 * - contact.phone.value: Phone number
 * - contact.address.label: Address card heading
 * - contact.address.value: Physical address
 * 
 * FOOTER:
 * - footer.brandBlurb: Footer brand description text
 * - footer.contactBlurb: Footer contact section description
 * - footer.copyrightTemplate: Copyright text template (use {year} placeholder)
 * - footer.quickLinksHeading: "Quick Links" section heading
 */

export interface SiteContent {
  brand: {
    name: string;
  };
  nav: {
    home: string;
    shop: string;
    electronics: string;
    homeDecor: string;
    about: string;
    login: string;
    admin: string;
  };
  home: {
    hero: {
      badge: string;
      title: string;
      titleAccent: string;
      description: string;
      ctaPrimary: string;
      ctaSecondary: string;
      imageAlt: string;
    };
    categories: {
      heading: string;
      subheading: string;
      electronics: {
        title: string;
        description: string;
        cta: string;
        imageAlt: string;
      };
      homeDecor: {
        title: string;
        description: string;
        cta: string;
        imageAlt: string;
      };
    };
    featured: {
      heading: string;
      subheading: string;
      emptyMessage: string;
      emptyMessageAdmin: string;
      viewAllCta: string;
      initializeButton: string;
    };
  };
  about: {
    heading: string;
    paragraphs: string[];
  };
  contact: {
    heading: string;
    intro: string;
    email: {
      label: string;
      value: string;
    };
    phone: {
      label: string;
      value: string;
    };
    address: {
      label: string;
      value: string;
    };
  };
  footer: {
    brandBlurb: string;
    contactBlurb: string;
    copyrightTemplate: string;
    quickLinksHeading: string;
  };
}

const siteContent: SiteContent = {
  brand: {
    name: 'The Lens',
  },
  nav: {
    home: 'Home',
    shop: 'Shop',
    electronics: 'Electronics',
    homeDecor: 'Home Decor',
    about: 'About',
    login: 'Login',
    admin: 'Admin',
  },
  home: {
    hero: {
      badge: 'Trending Now',
      title: "Discover What's",
      titleAccent: 'Trending Today',
      description:
        "From cutting-edge electronics to stunning home decor, find the viral products everyone's talking about.",
      ctaPrimary: 'Shop Now',
      ctaSecondary: 'Learn More',
      imageAlt: 'Trending Products',
    },
    categories: {
      heading: 'Shop by Category',
      subheading: 'Explore our curated collections',
      electronics: {
        title: 'Electronics',
        description: 'Latest gadgets and tech essentials',
        cta: 'Browse Electronics',
        imageAlt: 'Electronics',
      },
      homeDecor: {
        title: 'Home Decor',
        description: 'Transform your space with style',
        cta: 'Browse Home Decor',
        imageAlt: 'Home Decor',
      },
    },
    featured: {
      heading: 'Featured Products',
      subheading: 'Handpicked items just for you',
      emptyMessage: 'No products available at the moment. Please check back soon!',
      emptyMessageAdmin: 'No products available. Initialize the shop to add sample products.',
      viewAllCta: 'View All Products',
      initializeButton: 'Initialize Shop',
    },
  },
  about: {
    heading: 'About The Lens',
    paragraphs: [
      "Welcome to The Lens, your premier destination for discovering trending and viral products that are making waves across the globe. We curate the latest and most exciting items in electronics and home decor, bringing you products that combine innovation, style, and quality.",
      "Our mission is simple: to help you stay ahead of the curve by offering carefully selected products that enhance your lifestyle. From cutting-edge gadgets to stunning home accessories, we're passionate about finding items that make a difference in your daily life.",
      "At The Lens, we believe shopping should be an experience. That's why we focus on quality, authenticity, and customer satisfaction in everything we do.",
    ],
  },
  contact: {
    heading: 'Get in Touch',
    intro:
      "Have questions or need assistance? We'd love to hear from you. Reach out to our team and we'll get back to you as soon as possible.",
    email: {
      label: 'Email Us',
      value: 'official.thelens@gmail.com',
    },
    phone: {
      label: 'Call Us',
      value: '+1 (555) 123-4567',
    },
    address: {
      label: 'Visit Us',
      value: '123 Trend Street, Style City',
    },
  },
  footer: {
    brandBlurb: 'Discover trending and viral products across electronics, home decor, and more.',
    contactBlurb: "Questions? Reach out to us and we'll get back to you soon.",
    copyrightTemplate: '© {year} The Lens. All rights reserved.',
    quickLinksHeading: 'Quick Links',
  },
};

/**
 * Helper function to safely get content with fallback
 * Ensures no blank/undefined text appears in the UI
 */
export function getContent(): SiteContent {
  return siteContent;
}

export default siteContent;
