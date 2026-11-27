import type { Booking } from '@entities/booking/model/booking';
import { DEMO_BOOKINGS } from '@entities/booking/model/bookings.demo';
import { DEMO_STUDIOS } from '@entities/studio/model/studios.demo';

import type { Studio } from '@shared/model';

export type NewBookingBody = Pick<Booking, 'studioName' | 'startsAt' | 'hours' | 'pricePerHour'>;

/** «База данных» мок-сервера: живёт в памяти вкладки, перезагрузка страницы возвращает демо-данные */
export interface MockDb {
    searchStudios(query: string, city: string): Studio[];
    getStudio(id: string): Studio | undefined;
    replaceStudio(id: string, studio: Studio): Studio | undefined;
    listBookings(): Booking[];
    createBooking(body: NewBookingBody): Booking;
    deleteBooking(id: string): boolean;
}

export function createDb(): MockDb {
    // structuredClone: правки в «базе» не должны менять исходные демо-данные
    const studios = new Map(DEMO_STUDIOS.map((studio) => [studio.id, structuredClone(studio)]));
    const bookings = new Map(DEMO_BOOKINGS.map((booking) => [booking.id, { ...booking }]));
    let nextId = 1;

    return {
        searchStudios(query, city) {
            const needle = query.trim().toLowerCase();
            return [...studios.values()].filter(
                (studio) =>
                    (!city || studio.city === city) &&
                    (!needle ||
                        studio.name.toLowerCase().includes(needle) ||
                        studio.city.toLowerCase().includes(needle)),
            );
        },
        getStudio: (id) => studios.get(id),
        replaceStudio(id, studio) {
            if (!studios.has(id)) {
                return undefined;
            }
            // id из адреса главнее id из тела: подменить чужую студию телом запроса нельзя
            const saved = { ...studio, id };
            studios.set(id, saved);
            return saved;
        },
        listBookings: () => [...bookings.values()],
        createBooking(body) {
            const booking: Booking = {
                ...body,
                id: `b-${nextId++}`,
                discount: 0,
                status: 'PENDING',
            };
            bookings.set(booking.id, booking);
            return booking;
        },
        deleteBooking: (id) => bookings.delete(id),
    };
}
