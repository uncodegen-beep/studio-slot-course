import { signal } from '@angular/core';

import { createSlotPrice } from './slot-price';

describe('createSlotPrice', () => {
    const room = signal({ id: 'a', name: 'Зал A', pricePerHour: 1500 });

    it('дневной тариф: цена зала × часы', () => {
        const price = createSlotPrice(room, signal(2), signal(12));

        expect(price.isPeak()).toBe(false);
        expect(price.total()).toBe(3000);
    });

    it('вечерний тариф +20 %, пересчёт при смене сигналов', () => {
        const hours = signal(2);
        const start = signal(18);
        const price = createSlotPrice(room, hours, start);

        expect(price.total()).toBe(3600);

        hours.set(3);
        start.set(23);
        expect(price.isPeak()).toBe(false);
        expect(price.total()).toBe(4500);
    });

    it('зал не выбран — ноль', () => {
        expect(createSlotPrice(signal(null), signal(2), signal(12)).total()).toBe(0);
    });
});
