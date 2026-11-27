// Задание модуля 03: конфиг бронирования через InjectionToken и provide-функцию.
// Функций ещё нет — они описаны интерфейсом ниже: тест компилируется, но падает, пока их не сделать.
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import type { EnvironmentProviders } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DEMO_STUDIOS } from '../../src/entities/studio/model/studios.demo';
import * as bookingConfig from '../../src/features/book-slot/model/booking-config';
import { BookingPanelComponent } from '../../src/features/book-slot/ui/booking-panel/booking-panel.component';
import type { Studio } from '../../src/shared/model';

interface BookingConfigTask {
    /** Значения по умолчанию + переопределения; неверный конфиг — ошибка сразу */
    provideBookingConfig(config: Partial<bookingConfig.BookingConfig>): EnvironmentProviders;
    /** Часы начала слотов по конфигу. Только в контексте внедрения */
    injectStartHours(): readonly number[];
}

const task = bookingConfig as unknown as BookingConfigTask;

function startHours(): readonly number[] {
    return TestBed.runInInjectionContext(() => task.injectStartHours());
}

describe('Модуль 03 · конфиг бронирования', () => {
    it('по умолчанию: слоты с 10 до 20 с шагом 2 часа', () => {
        expect(startHours()).toEqual([10, 12, 14, 16, 18, 20]);
    });

    it('provideBookingConfig: свои значения поверх значений по умолчанию', () => {
        TestBed.configureTestingModule({
            providers: [task.provideBookingConfig({ openHour: 9, closeHour: 13, stepHours: 1 })],
        });

        expect(startHours()).toEqual([9, 10, 11, 12]);
        expect(TestBed.inject(bookingConfig.BOOKING_CONFIG).maxHours).toBe(4);
    });

    it('неверный конфиг — ошибка при вызове provideBookingConfig', () => {
        expect(() => task.provideBookingConfig({ openHour: 22, closeHour: 10 })).toThrow();
        expect(() => task.provideBookingConfig({ stepHours: 0 })).toThrow();
    });

    it('injectStartHours вне контекста внедрения — ошибка', () => {
        expect(() => task.injectStartHours()).toThrow(/injection context/);
    });

    it('панель бронирования берёт часы начала и длительности из конфига', async () => {
        TestBed.configureTestingModule({
            providers: [
                // С урока 70 панель отправляет заявки по HTTP
                provideHttpClient(),
                provideHttpClientTesting(),
                task.provideBookingConfig({
                    openHour: 8,
                    closeHour: 12,
                    stepHours: 2,
                    maxHours: 2,
                }),
            ],
        });
        const fixture = TestBed.createComponent(BookingPanelComponent);
        fixture.componentRef.setInput('studio', DEMO_STUDIOS[0] as Studio);
        await fixture.whenStable();
        const root = fixture.nativeElement as HTMLElement;

        const options = [...root.querySelectorAll('select option')].map((o) =>
            o.textContent?.trim(),
        );
        expect(options).toEqual(['8:00', '10:00']);
        expect(root.querySelectorAll('app-duration-picker button')).toHaveLength(2);
    });
});
