import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FavoritesStore } from '@features/toggle-favorite/model/favorites.store';

import { CatalogStore } from '@entities/studio/model/catalog.store';

/** Избранные студии: /account/favorites. Два стора — один список */
@Component({
    selector: 'app-favorites-page',
    imports: [RouterLink],
    template: `
        <h1>Избранное</h1>
        @if (studios().length) {
            <ul class="favorites">
                @for (studio of studios(); track studio.id) {
                    <li>
                        <a [routerLink]="['/studios', studio.id]">{{ studio.name }}</a>
                        · {{ studio.city }}
                        <button
                            type="button"
                            (click)="favorites.toggle(studio.id)"
                        >
                            Убрать
                        </button>
                    </li>
                }
            </ul>
        } @else {
            <p class="empty">
                Пока пусто. Отметьте студии сердечком в
                <a routerLink="/studios">каталоге</a>.
            </p>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesPageComponent {
    protected readonly favorites = inject(FavoritesStore);
    private readonly catalog = inject(CatalogStore);

    protected readonly studios = computed(() =>
        this.catalog.studios().filter((studio) => this.favorites.favorites().has(studio.id)),
    );
}
