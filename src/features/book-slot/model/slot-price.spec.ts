import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { PricingService } from './pricing.service';
import { PromoPricingService } from './promo-pricing.service';
import { createSlotPrice } from './slot-price';

const room = signal({ id: 'a', name: 'Зал A', pricePerHour: 1500 });

describe('createSlotPrice', () => {
    it('считает по правилам PricingService и пересчитывается при смене сигналов', () => {
        const hours = signal(2);
        const start = signal(12);
        // inject() внутри фабрики — нужен контекст внедрения
        const price = TestBed.runInInjectionContext(() => createSlotPrice(room, hours, start));

        expect(price.total()).toBe(3000);

        hours.set(3);
        start.set(18);
        expect(price.isPeak()).toBe(true);
        expect(price.total()).toBe(5400);
    });

    it('зал не выбран — ноль', () => {
        const price = TestBed.runInInjectionContext(() =>
            createSlotPrice(signal(null), signal(2), signal(12)),
        );

        expect(price.total()).toBe(0);
    });

    it('DI: реализацию подменяет провайдер — фабрика и компоненты не меняются', () => {
        // промо: вечерний тариф отключён
        TestBed.configureTestingModule({
            providers: [
                { provide: PricingService, useValue: { isPeak: () => false, quote: () => 999 } },
            ],
        });

        const price = TestBed.runInInjectionContext(() =>
            createSlotPrice(room, signal(2), signal(20)),
        );

        expect(price.isPeak()).toBe(false);
        expect(price.total()).toBe(999);
    });

    it('useClass: промо-реализация под тем же токеном PricingService', () => {
        TestBed.configureTestingModule({
            providers: [{ provide: PricingService, useClass: PromoPricingService }],
        });

        const price = TestBed.runInInjectionContext(() =>
            createSlotPrice(room, signal(2), signal(20)),
        );

        expect(price.isPeak()).toBe(false);
        expect(price.total()).toBe(3000);
    });
});
