import {
    type EnvironmentProviders,
    InjectionToken,
    assertInInjectionContext,
    inject,
    makeEnvironmentProviders,
} from '@angular/core';

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

/** Ошибка в конфиге видна при старте приложения, а не когда клиент откроет панель */
function assertValid(config: BookingConfig): void {
    const { openHour, closeHour, stepHours, maxHours } = config;
    const isHour = (value: number): boolean => Number.isInteger(value) && value >= 0 && value <= 24;

    if (!isHour(openHour) || !isHour(closeHour) || openHour >= closeHour) {
        throw new Error(
            `BOOKING_CONFIG: нужно 0 ≤ openHour < closeHour ≤ 24, а не ${openHour}–${closeHour}`,
        );
    }
    if (!Number.isInteger(stepHours) || stepHours < 1) {
        throw new Error(`BOOKING_CONFIG: stepHours — целое число от 1, а не ${stepHours}`);
    }
    if (!Number.isInteger(maxHours) || maxHours < 1) {
        throw new Error(`BOOKING_CONFIG: maxHours — целое число от 1, а не ${maxHours}`);
    }
}

/** Значения по умолчанию + переопределения: provideBookingConfig({ closeHour: 23 }) */
export function provideBookingConfig(config: Partial<BookingConfig>): EnvironmentProviders {
    const merged: BookingConfig = { ...DEFAULT_BOOKING_CONFIG, ...config };
    assertValid(merged);
    return makeEnvironmentProviders([{ provide: BOOKING_CONFIG, useValue: merged }]);
}

/** Часы начала слотов: от открытия с шагом stepHours, пока час занятия успевает до закрытия */
export function startHoursOf(config: BookingConfig): readonly number[] {
    const hours: number[] = [];
    for (let hour = config.openHour; hour + 1 <= config.closeHour; hour += config.stepHours) {
        hours.push(hour);
    }
    return hours;
}

/** Часы начала по конфигу текущего инжектора. Вызывать в поле класса или конструкторе */
export function injectStartHours(): readonly number[] {
    assertInInjectionContext(injectStartHours);
    return startHoursOf(inject(BOOKING_CONFIG));
}
