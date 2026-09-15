// Shared domain types for site-data and UI props.

export type ThemeMode = 'light' | 'dark';

export interface Phone {
  value: string;
  href: string;
}

export interface Address {
  streetAddress: string;
  addressNote: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
  latitude: number;
  longitude: number;
  mapUrl: string;
}

export interface ServiceRegion {
  name: string;
  cities?: string[];
}

export interface SeoConfig {
  siteUrl: string;
  title: string;
  description: string;
  keywords: string;
  region: string;
  ogImageWidth: number;
  ogImageHeight: number;
  ogImage: string;
  serviceArea: {
    featuredCities: string[];
    regions: ServiceRegion[];
  };
}

export interface PricingItem {
  label: string;
  from: number;
  currency: string;
}

export interface CalculatorTypeConfig {
  label: string;
  rate: number;
  baseCost: number;
}

export interface CalculatorOption {
  label: string;
  cost: number;
}

export interface CalculatorConfig {
  types: Record<string, CalculatorTypeConfig>;
  panelMultipliers: Record<string, number>;
  extraGateCost: number;
  foundationRate: number;
  options: Record<string, CalculatorOption>;
  range: { minimum: number; maximum: number };
}

export interface LegalBank {
  name: string;
  account: string;
  bic: string;
  corrAccount: string;
}

export interface Legal {
  form: string;
  fullName: string;
  inn: string;
  ogrnip: string;
  bank: LegalBank;
}

export interface Messenger {
  id: string;
  label: string;
  href: string;
  hint: string;
}

export interface HeroContent {
  title: string;
  text: string;
  sizes: { value: string; detail: string };
  geo: string[];
  warranty: { value: string; detail: string };
}

export interface WorkflowStep {
  title: string;
  text: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface CatalogSlide {
  title: string;
  size?: string;
  meta?: string;
  img: string;
}

export interface GarageProject {
  title: string;
  size: string;
  price: number;
  specs: string[];
  location: string;
  img: string;
  imgWidth: number;
  imgHeight: number;
}

export interface CompositionItem {
  title: string;
  text: string;
  img: string;
}

export type RoofIconKey = 'gable' | 'side' | 'back';

export interface RoofItem {
  title: string;
  text: string;
  icon: RoofIconKey;
}

export interface AdvantageItem {
  title: string;
  value: string;
  lines: string[];
}

export interface ExtraItem {
  title: string;
  text: string;
}

export interface PriceFactor {
  title: string;
  text: string;
}

export interface ServiceAreaSection {
  title: string;
  eyebrow: string;
  text: string;
  moreLabel: string;
}

export interface Company {
  name: string;
  shortName: string;
  tagline: string;
  seo: SeoConfig;
  address: Address;
  phones: Phone[];
  email: string;
  hours: string;
  analytics: {
    yandexMetrika: {
      counterId: number;
      allowedHosts: string[];
    };
  };
  pricing: {
    garages: PricingItem;
    canopies: PricingItem;
  };
  calculator: CalculatorConfig;
  serviceAreaSection: ServiceAreaSection;
  legal: Legal;
  messengers: Messenger[];
  hero: HeroContent;
  workflow: {
    title: string;
    text: string;
    steps: WorkflowStep[];
  };
  faq: FaqItem[];
  garages: CatalogSlide[];
  garageProjects: GarageProject[];
  canopies: CatalogSlide[];
  composition: CompositionItem[];
  roofs: RoofItem[];
  services: string[];
  extras: ExtraItem[];
  advantages: AdvantageItem[];
  priceFactors: PriceFactor[];
}
