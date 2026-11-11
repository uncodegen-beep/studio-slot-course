import { TestBed } from '@angular/core/testing';

import { CatalogStore } from './catalog.store';

describe('CatalogStore', () => {
    it('поиск и фильтр города работают вместе', () => {
        const store = TestBed.inject(CatalogStore);

        store.setQuery('records');
        store.setCity('Казань');

        expect(store.filtered().map((studio) => studio.name)).toEqual(['Volga Records']);
        expect(store.count()).toBe(1);
    });

    it('сброс уже сброшенных фильтров не пересчитывает список', () => {
        const store = TestBed.inject(CatalogStore);
        const before = store.filtered();

        store.resetFilters();

        expect(store.filtered()).toBe(before);
    });

    it('города — из данных, без повторов и по алфавиту', () => {
        expect(TestBed.inject(CatalogStore).cities()).toEqual([
            'Казань',
            'Москва',
            'Санкт-Петербург',
        ]);
    });
});
