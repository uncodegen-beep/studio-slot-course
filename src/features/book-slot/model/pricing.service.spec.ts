import { TestBed } from '@angular/core/testing';

import { APP_CONFIG } from '@shared/config/app-config';

import { PricingService } from './pricing.service';

describe('PricingService', () => {
    it('дневной тариф и вечерний +20 %', () => {
        const pricing = TestBed.inject(PricingService);

        expect(pricing.quote(1500, 2, 12)).toBe(3000);
        expect(pricing.quote(1500, 2, 18)).toBe(3600);
        expect(pricing.isPeak(23)).toBe(false);
    });

    it('InjectionToken: тариф берётся из APP_CONFIG и подменяется одной строкой', () => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: APP_CONFIG,
                    useValue: { apiBaseUrl: 'api', peakFrom: 10, peakTo: 12, peakMultiplier: 2 },
                },
            ],
        });
        const pricing = TestBed.inject(PricingService);

        expect(pricing.quote(1500, 2, 10)).toBe(6000);
        expect(pricing.quote(1500, 2, 18)).toBe(3000);
    });

    it('один экземпляр на приложение', () => {
        expect(TestBed.inject(PricingService)).toBe(TestBed.inject(PricingService));
    });
});
