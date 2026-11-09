import type { Booking } from './booking';

/** Демо-бронирования до появления API (модуль 06) */
export const DEMO_BOOKINGS: Booking[] = [
    {
        id: 'b-1',
        studioName: 'Sound Garden',
        startsAt: '2026-11-14T18:00',
        hours: 3,
        pricePerHour: 1500,
        discount: 0.1,
        status: 'CONFIRMED',
    },
    {
        id: 'b-2',
        studioName: 'Nevsky Beat',
        startsAt: '2026-11-21T12:00',
        hours: 2,
        pricePerHour: 1200,
        discount: 0,
        status: 'PENDING',
    },
    {
        id: 'b-3',
        studioName: 'Volga Records',
        startsAt: '2026-11-02T10:00',
        hours: 1,
        pricePerHour: 900,
        discount: 0,
        status: 'CANCELED',
    },
];
