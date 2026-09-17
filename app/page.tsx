import { company } from '@/lib/site-data';
import { buildJsonLd } from '@/lib/seo';
import { LandingLinks } from '@/components/sections/LandingLinks';
// Single-page landing: section order matches the marketing narrative.

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
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
import {
  ClientEffects,
  ScrollTopButton,
} from '@/components/effects/ClientEffects';

export default function HomePage() {
  return (
    <>
      {/* Preload the LCP hero project image. */}
      <link
        rel="preload"
        href="/assets/garage-project-8-8-v2-960.webp"
        as="image"
        type="image/webp"
        imageSrcSet="/assets/garage-project-8-8-v2-560.webp 560w, /assets/garage-project-8-8-v2-960.webp 960w, /assets/garage-project-8-8-v2.webp 1672w"
        imageSizes="(max-width: 1120px) 92vw, 52vw"
      />
      <script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildJsonLd(company)),
        }}
      />
      <a className="skip-link" href="#contact">
        Перейти к контактам
      </a>
      <Header />
      <main id="top">
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
        <Faq />
        <ServiceArea />
        <Contact />
      </main>
      <Footer />
      {/* Client islands mounted once at the page root. */}
      <ScrollTopButton />
      <Lightbox />
      <ClientEffects />
    </>
  );
}
