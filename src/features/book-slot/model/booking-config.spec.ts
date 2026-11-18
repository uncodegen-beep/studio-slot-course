import { TestBed } from '@angular/core/testing';

import {
    BOOKING_CONFIG,
    DEFAULT_BOOKING_CONFIG,
    injectStartHours,
    provideBookingConfig,
    startHoursOf,
} from './booking-config';

describe('BOOKING_CONFIG', () => {
    it('по умолчанию — factory токена', () => {
        expect(TestBed.inject(BOOKING_CONFIG)).toEqual(DEFAULT_BOOKING_CONFIG);
        expect(TestBed.runInInjectionContext(() => injectStartHours())).toEqual([
            10, 12, 14, 16, 18, 20,
        ]);
    });

    it('provideBookingConfig: переопределения поверх значений по умолчанию', () => {
        TestBed.configureTestingModule({ providers: [provideBookingConfig({ closeHour: 23 })] });

        expect(TestBed.inject(BOOKING_CONFIG)).toEqual({
            ...DEFAULT_BOOKING_CONFIG,
            closeHour: 23,
        });
    });

    it('слот должен успеть закончиться до закрытия', () => {
        expect(startHoursOf({ ...DEFAULT_BOOKING_CONFIG, closeHour: 21 })).toEqual([
            10, 12, 14, 16, 18, 20,
        ]);
        expect(startHoursOf({ ...DEFAULT_BOOKING_CONFIG, closeHour: 20 })).toEqual([
            10, 12, 14, 16, 18,
        ]);
    });

    it('неверный конфиг — ошибка сразу', () => {
        expect(() => provideBookingConfig({ openHour: 22, closeHour: 10 })).toThrow(/openHour/);
        expect(() => provideBookingConfig({ closeHour: 25 })).toThrow(/closeHour/);
        expect(() => provideBookingConfig({ stepHours: 0 })).toThrow(/stepHours/);
        expect(() => provideBookingConfig({ maxHours: 1.5 })).toThrow(/maxHours/);
    });

    it('injectStartHours вне контекста внедрения — ошибка с именем функции', () => {
        expect(() => injectStartHours()).toThrow(/injectStartHours\(\)/);
    });
});
