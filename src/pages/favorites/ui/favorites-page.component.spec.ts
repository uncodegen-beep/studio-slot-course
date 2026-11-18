import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { FavoritesStore } from '@features/toggle-favorite/model/favorites.store';

import { FavoritesPageComponent } from './favorites-page.component';

describe('FavoritesPageComponent', () => {
    beforeEach(() => {
        localStorage.clear();
        TestBed.configureTestingModule({ providers: [provideRouter([])] });
    });

    it('пустое избранное — подсказка со ссылкой в каталог', () => {
        const fixture = TestBed.createComponent(FavoritesPageComponent);
        fixture.detectChanges();
        const root = fixture.nativeElement as HTMLElement;

        expect(root.querySelector('.empty a')?.getAttribute('href')).toBe('/studios');
    });

    it('показывает отмеченные студии, «Убрать» удаляет из списка', async () => {
        TestBed.inject(FavoritesStore).toggle('nevsky-beat');
        const fixture = TestBed.createComponent(FavoritesPageComponent);
        await fixture.whenStable();
        const root = fixture.nativeElement as HTMLElement;

        expect(root.querySelector('.favorites a')?.getAttribute('href')).toBe(
            '/studios/nevsky-beat',
        );

        root.querySelector<HTMLButtonElement>('.favorites button')?.click();
        await fixture.whenStable();

        expect(root.querySelector('.favorites')).toBeNull();
    });
});
