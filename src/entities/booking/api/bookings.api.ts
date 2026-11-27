import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import type { Observable } from 'rxjs';

import { APP_CONFIG } from '@shared/config/app-config';

import type { Booking } from '../model/booking';

export type NewBooking = Pick<Booking, 'studioName' | 'startsAt' | 'hours' | 'pricePerHour'>;

/** Бронирования: GET — список, POST — создать, DELETE — удалить */
@Injectable({ providedIn: 'root' })
export class BookingsApi {
    private readonly http = inject(HttpClient);
    private readonly url = `${inject(APP_CONFIG).apiBaseUrl}/bookings`;

    list(): Observable<Booking[]> {
        return this.http.get<Booking[]>(this.url);
    }

    /** POST: тело — новая бронь, ответ 201 — она же с id и статусом от сервера */
    create(draft: NewBooking): Observable<Booking> {
        return this.http.post<Booking>(this.url, draft);
    }

    /** DELETE: ответ 204 без тела — поэтому Observable<void> */
    remove(id: string): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}
