import { describe, expect, it } from 'vitest';
import { company } from '@/lib/site-data';
import { buildJsonLd } from '@/lib/seo';

describe('service price units', () => {
  it('identifies base rates as prices per square metre, not whole projects', () => {
    const graph = buildJsonLd(company)['@graph'];
    const business = graph.find(
      (node) => node['@type'] === 'HomeAndConstructionBusiness',
    );
    const catalogs = business?.hasOfferCatalog as Array<{
      itemListElement: Array<{
        name: string;
        priceSpecification: Record<string, unknown>;
      }>;
    }>;
    expect(business?.priceRange).toContain('₽/м²');
    const offers = catalogs.map((catalog) => catalog.itemListElement[0]);
    expect(offers[0].priceSpecification).toMatchObject({
      '@type': 'UnitPriceSpecification',
      minPrice: 22000,
      priceCurrency: 'RUB',
      unitCode: 'MTK',
      unitText: 'м²',
      referenceQuantity: { '@type': 'QuantitativeValue', value: 1 },
    });
    expect(offers[1].priceSpecification).toMatchObject({
      minPrice: 6000,
      unitCode: 'MTK',
    });
    expect(offers.every((offer) => offer.name.includes('₽/м²'))).toBe(true);
  });
});
