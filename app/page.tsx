import { company } from '@/lib/site-data';
import { buildJsonLd } from '@/lib/seo';
import { heroProjectImage } from '@/lib/images';
import { PageShell } from '@/components/layout/PageShell';
import { LandingLinks } from '@/components/sections/LandingLinks';
// Single-page landing: section order matches the marketing narrative.

import { Hero } from '@/components/sections/Hero';
import { SpecTicker } from '@/components/sections/SpecTicker';
import { Garages } from '@/components/sections/Garages';
import { Canopies } from '@/components/sections/Canopies';
import { Projects } from '@/components/sections/Projects';
import { Composition } from '@/components/sections/Composition';
import { Roofs } from '@/components/sections/Roofs';
import { Services } from '@/components/sections/Services';
import { Advantages } from '@/components/sections/Advantages';
import { Extras } from '@/components/sections/Extras';
import { PriceFactors } from '@/components/sections/PriceFactors';
import { Calculator } from '@/components/sections/Calculator';
import { Workflow } from '@/components/sections/Workflow';
import { Faq } from '@/components/sections/Faq';
import { ServiceArea } from '@/components/sections/ServiceArea';
import { Contact } from '@/components/sections/Contact';
import { Lightbox } from '@/components/ui/Lightbox';

export default function HomePage() {
  return (
    <PageShell
      before={
        /* Preload the LCP hero project image. */
        <link
          rel="preload"
          href={heroProjectImage.preloadHref}
          as="image"
          type={heroProjectImage.type}
          imageSrcSet={heroProjectImage.srcSet}
          imageSizes={heroProjectImage.sizes}
        />
      }
      jsonLd={buildJsonLd(company)}
      jsonLdId="json-ld"
      skipHref="#contact"
      skipLabel="Перейти к контактам"
      afterFooter={<Lightbox />}
    >
      <Hero />
      <SpecTicker />
      <LandingLinks />
      <Garages />
      <Canopies />
      <Projects />
      <Composition />
      <Roofs />
      <Services />
      <Advantages />
      <Extras />
      <PriceFactors />
      <Calculator />
      <Workflow />
      <Faq items={company.faq} />
      <ServiceArea />
      <Contact />
    </PageShell>
  );
}
