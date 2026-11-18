import { InjectionToken } from '@angular/core';

/** Правила расписания площадки: когда открыта, с каким шагом начинаются слоты, сколько часов максимум */
export interface BookingConfig {
    /** Первый час, с которого можно начать бронирование */
    readonly openHour: number;
    /** Час закрытия: бронирование должно закончиться не позже */
    readonly closeHour: number;
    /** Шаг между началами слотов, в часах */
    readonly stepHours: number;
    /** Максимум часов в одном бронировании */
    readonly maxHours: number;
}

export const DEFAULT_BOOKING_CONFIG: BookingConfig = {
    openHour: 10,
    closeHour: 22,
    stepHours: 2,
    maxHours: 4,
};

/** Значение по умолчанию есть всегда: регистрировать токен не обязательно */
export const BOOKING_CONFIG = new InjectionToken<BookingConfig>('BOOKING_CONFIG', {
    providedIn: 'root',
    factory: () => DEFAULT_BOOKING_CONFIG,
});

// Задание модуля 03 (tasks/module-03): допишите здесь provideBookingConfig и injectStartHours
