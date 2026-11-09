import type { BookingStatus } from '@shared/model';

/** Бронирование студии на время */
export interface Booking {
    readonly id: string;
    studioName: string;
    /** Начало сессии: дата и время без часового пояса, например 2026-11-14T18:00 */
    startsAt: string;
    hours: number;
    pricePerHour: number;
    /** Скидка 0–1: 0.1 — это 10 % */
    discount: number;
    status: BookingStatus;
}
