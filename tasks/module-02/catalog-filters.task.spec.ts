// Задание модуля 02: фильтр по цене, «изменены ли фильтры» и кнопка сброса — без единого effect.
// Методы, которых ещё нет, описаны интерфейсом ниже: тест компилируется, но падает, пока их не сделать.
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CatalogStore } from '../../src/entities/studio/model/catalog.store';
import { CatalogPageComponent } from '../../src/pages/catalog/ui/catalog-page.component';

interface CatalogStoreTask {
    setMaxPrice(price: number | null): void;
    setCity(city: string): void;
    resetFilters(): void;
    isDirty(): boolean;
    filtered(): { name: string }[];
    count(): number;
}

function store(): CatalogStoreTask {
    return TestBed.inject(CatalogStore) as unknown as CatalogStoreTask;
}

describe('Модуль 02 · фильтры каталога', () => {
    it('фильтр «цена до»: подходит студия, у которой хотя бы один зал не дороже', () => {
        store().setMaxPrice(1300);

        expect(
            store()
                .filtered()
                .map((studio) => studio.name),
        ).toEqual(['Nevsky Beat', 'Volga Records']);
        expect(store().count()).toBe(2);

        store().setMaxPrice(null);
        expect(store().count()).toBe(3);
    });

    it('isDirty: фильтры изменены — true, после сброса — false', () => {
        expect(store().isDirty()).toBe(false);

        store().setCity('Москва');
        expect(store().isDirty()).toBe(true);

        store().resetFilters();
        expect(store().isDirty()).toBe(false);
    });

    it('кнопка «Сбросить фильтры» активна только при изменённых фильтрах', async () => {
        TestBed.configureTestingModule({ providers: [provideRouter([])] });
        const fixture = TestBed.createComponent(CatalogPageComponent);
        await fixture.whenStable();
        const reset = (): HTMLButtonElement | undefined =>
            [...(fixture.nativeElement as HTMLElement).querySelectorAll('button')].find(
                (button) => button.textContent?.trim() === 'Сбросить фильтры',
            );

        expect(reset()?.disabled).toBe(true);

        store().setMaxPrice(1000);
        await fixture.whenStable();
        expect(reset()?.disabled).toBe(false);
    });
});
