import { TestBed } from '@angular/core/testing';

import type { Booking } from '../model/booking';
import { BookingsApi, CREATE_BOOKING_MS } from './bookings.api';

describe('BookingsApi', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('create отвечает через CREATE_BOOKING_MS заявкой в статусе PENDING', () => {
        let created: Booking | undefined;

        TestBed.inject(BookingsApi)
            .create({
                studioName: 'Sound Garden',
                startsAt: '2026-11-20T12:00',
                hours: 2,
                pricePerHour: 1500,
            })
            .subscribe((booking) => (created = booking));
        vi.advanceTimersByTime(CREATE_BOOKING_MS - 1);
        expect(created).toBeUndefined();

        vi.advanceTimersByTime(1);
        expect(created).toMatchObject({
            studioName: 'Sound Garden',
            status: 'PENDING',
            discount: 0,
        });
    });
});
