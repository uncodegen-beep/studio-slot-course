import { TestBed } from '@angular/core/testing';

import { FavoritesStore } from './favorites.store';

describe('FavoritesStore', () => {
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
});
