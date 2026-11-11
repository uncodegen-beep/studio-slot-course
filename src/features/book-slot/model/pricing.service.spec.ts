import { TestBed } from '@angular/core/testing';

import { PricingService } from './pricing.service';

describe('PricingService', () => {
    it('дневной тариф и вечерний +20 %', () => {
        const pricing = TestBed.inject(PricingService);

        expect(pricing.quote(1500, 2, 12)).toBe(3000);
        expect(pricing.quote(1500, 2, 18)).toBe(3600);
        expect(pricing.isPeak(23)).toBe(false);
    });

    it('один экземпляр на приложение', () => {
        expect(TestBed.inject(PricingService)).toBe(TestBed.inject(PricingService));
    });
});
