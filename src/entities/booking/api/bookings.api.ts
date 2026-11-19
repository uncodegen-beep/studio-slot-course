import { Injectable } from '@angular/core';

import { type Observable, map, timer } from 'rxjs';

import type { Booking } from '../model/booking';

export type NewBooking = Pick<Booking, 'studioName' | 'startsAt' | 'hours' | 'pricePerHour'>;

/** Ответ «сервера» приходит не сразу — как настоящий POST */
export const CREATE_BOOKING_MS = 800;

let nextId = 1;

/**
 * Бронирования. Сервера бронирований пока нет (модуль 06):
 * create имитирует POST — заявка «создаётся» через CREATE_BOOKING_MS
 */
@Injectable({ providedIn: 'root' })
export class BookingsApi {
    create(draft: NewBooking): Observable<Booking> {
        return timer(CREATE_BOOKING_MS).pipe(
            map(() => ({
                ...draft,
                id: `new-${nextId++}`,
                discount: 0,
                status: 'PENDING' as const,
            })),
        );
    }
}
