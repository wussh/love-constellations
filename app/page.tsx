import ConstellationPage from '@/components/constellation-page';
import { ErrorBoundary } from '@/components/error-boundary';

export default function Home() {
  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Love Constellations',
    description: 'Share your unsent love messages anonymously as stars in a beautiful interactive constellation',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Anonymous message posting',
      'Interactive star visualization',
      'Theme-based categorization',
      'Twin star matching with secret codes',
      'Real-time constellation updates',
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <ErrorBoundary>
        <ConstellationPage />
      </ErrorBoundary>
    </>
  );
}
