import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import type { Booking } from '../model/booking';
import { BookingsApi } from './bookings.api';

describe('BookingsApi', () => {
    let api: BookingsApi;
    let http: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        api = TestBed.inject(BookingsApi);
        http = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        http.verify();
    });

    it('list — GET /api/bookings', () => {
        let count = 0;

        api.list().subscribe((bookings) => (count = bookings.length));
        const request = http.expectOne('api/bookings');
        request.flush([{ id: 'b-1' }, { id: 'b-2' }]);

        expect(request.request.method).toBe('GET');
        expect(count).toBe(2);
    });

    it('create — POST с телом новой брони, ответ — бронь от сервера', () => {
        const draft = {
            studioName: 'Sound Garden',
            startsAt: '2026-11-22T12:00',
            hours: 2,
            pricePerHour: 1500,
        };
        let created: Booking | undefined;

        api.create(draft).subscribe((booking) => (created = booking));
        const request = http.expectOne('api/bookings');
        request.flush(
            { ...draft, id: 'b-1', discount: 0, status: 'PENDING' },
            { status: 201, statusText: 'Created' },
        );

        expect(request.request.method).toBe('POST');
        expect(request.request.body).toEqual(draft);
        expect(created?.id).toBe('b-1');
    });

    it('remove — DELETE /api/bookings/:id', () => {
        let done = false;

        api.remove('b-1').subscribe({ complete: () => (done = true) });
        const request = http.expectOne('api/bookings/b-1');
        request.flush(null, { status: 204, statusText: 'No Content' });

        expect(request.request.method).toBe('DELETE');
        expect(done).toBe(true);
    });
});
