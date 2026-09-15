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
      <a className="skip-link" href="#contact">
        Перейти к контактам
      </a>
      <Header />
      <main id="top">
        <Hero />
        <SpecTicker />
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
