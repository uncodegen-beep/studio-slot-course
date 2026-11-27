import { DEMO_STUDIOS } from '@entities/studio/model/studios.demo';

import type { Studio } from '@shared/model';

import { createDb } from './db';

describe('мок-база', () => {
    it('поиск по названию и городу без учёта регистра, фильтр по городу', () => {
        const db = createDb();

        expect(db.searchStudios('SOUND', '').map((studio) => studio.id)).toEqual(['sound-garden']);
        expect(db.searchStudios('казань', '').map((studio) => studio.id)).toEqual([
            'volga-records',
        ]);
        expect(db.searchStudios('', 'Москва')).toHaveLength(1);
        expect(db.searchStudios('', '')).toHaveLength(DEMO_STUDIOS.length);
    });

    it('замена студии не меняет исходные демо-данные', () => {
        const db = createDb();
        const studio = db.getStudio('sound-garden') as Studio;

        db.replaceStudio('sound-garden', { ...studio, description: 'Новое' });

        expect(db.getStudio('sound-garden')?.description).toBe('Новое');
        expect(DEMO_STUDIOS[0]?.description).toBeUndefined();
        expect(db.replaceStudio('nope', studio)).toBeUndefined();
    });

    it('бронь: создание с id и статусом PENDING, удаление', () => {
        const db = createDb();
        const before = db.listBookings().length;

        const booking = db.createBooking({
            studioName: 'Sound Garden',
            startsAt: '2026-11-22T12:00',
            hours: 2,
            pricePerHour: 1500,
        });

        expect(booking).toMatchObject({ id: 'b-1', status: 'PENDING', discount: 0 });
        expect(db.listBookings()).toHaveLength(before + 1);
        expect(db.deleteBooking('b-1')).toBe(true);
        expect(db.deleteBooking('b-1')).toBe(false);
    });
});
