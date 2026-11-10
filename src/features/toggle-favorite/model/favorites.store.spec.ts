import { TestBed } from '@angular/core/testing';

import { FavoritesStore } from './favorites.store';

const KEY = 'studioslot.favorites';

describe('FavoritesStore', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('toggle добавляет и убирает студию', () => {
        const store = TestBed.inject(FavoritesStore);

        store.toggle('sound-garden');
        expect(store.favorites().has('sound-garden')).toBe(true);

        store.toggle('sound-garden');
        expect(store.favorites().size).toBe(0);
    });

    it('каждое изменение — новый Set, старое значение не мутируется', () => {
        const store = TestBed.inject(FavoritesStore);
        const before = store.favorites();

        store.toggle('volga-records');

        expect(store.favorites()).not.toBe(before);
        expect(before.size).toBe(0);
    });

    it('наружу — только чтение', () => {
        const store = TestBed.inject(FavoritesStore);

        expect('set' in store.favorites).toBe(false);
    });

    it('effect сохраняет избранное в localStorage', () => {
        const store = TestBed.inject(FavoritesStore);

        store.toggle('sound-garden');
        // эффекты выполняются асинхронно — TestBed.tick() прогоняет их сейчас
        TestBed.tick();

        expect(JSON.parse(localStorage.getItem(KEY) ?? '[]')).toEqual(['sound-garden']);
    });

    it('при создании читает сохранённое, битые данные не ломают стор', () => {
        localStorage.setItem(KEY, JSON.stringify(['nevsky-beat', 42]));
        expect(TestBed.inject(FavoritesStore).favorites()).toEqual(new Set(['nevsky-beat']));

        TestBed.resetTestingModule();
        localStorage.setItem(KEY, '{не json');
        expect(TestBed.inject(FavoritesStore).favorites().size).toBe(0);
    });
});
