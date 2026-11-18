import { TestBed } from '@angular/core/testing';

import { PricingService } from './pricing.service';
import { PromoPricingService } from './promo-pricing.service';
import { providePricing, withPromo, withPromoFromQuery } from './provide-pricing';

describe('providePricing', () => {
    afterEach(() => {
        history.replaceState(null, '', '/');
    });

    it('без опций — обычный тариф с вечерней наценкой', () => {
        TestBed.configureTestingModule({ providers: [providePricing()] });

        expect(TestBed.inject(PricingService).isPeak(20)).toBe(true);
    });

    it('withPromo — промо-тариф', () => {
        TestBed.configureTestingModule({ providers: [providePricing(withPromo())] });

        const pricing = TestBed.inject(PricingService);

        expect(pricing).toBeInstanceOf(PromoPricingService);
        expect(pricing.isPeak(20)).toBe(false);
    });

    it('withPromoFromQuery — промо только с ?promo в адресе', () => {
        history.replaceState(null, '', '/studios?promo');
        TestBed.configureTestingModule({ providers: [providePricing(withPromoFromQuery())] });

        expect(TestBed.inject(PricingService)).toBeInstanceOf(PromoPricingService);
    });

    it('withPromoFromQuery без параметра — обычный тариф', () => {
        TestBed.configureTestingModule({ providers: [providePricing(withPromoFromQuery())] });

        expect(TestBed.inject(PricingService)).not.toBeInstanceOf(PromoPricingService);
    });
});
