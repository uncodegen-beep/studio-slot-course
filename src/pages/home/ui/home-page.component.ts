import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { StudioSearchComponent } from '@features/search-studios/ui/studio-search.component';

import { CatalogStore } from '@entities/studio/model/catalog.store';

/** Главная: адрес «/». Подключена в маршрутах напрямую через component — она нужна сразу */
@Component({
    selector: 'app-home-page',
    imports: [RouterLink, StudioSearchComponent],
    template: `
        <section class="hero">
            <h1>Студии для репетиций, записи и съёмок — по часам</h1>
            <p>Выберите зал, время и длительность: цена с вечерним тарифом считается сразу.</p>
            <a
                class="cta"
                routerLink="/studios"
            >
                Смотреть студии
            </a>
        </section>

        <app-studio-search />

        <h2>Города</h2>
        <ul class="cities">
            @for (city of cities(); track city) {
                <!-- /studios?city=Казань — каталог прочитает параметр в свой вход city -->
                <li>
                    <a
                        routerLink="/studios"
                        [queryParams]="{ city }"
                    >
                        {{ city }}
                    </a>
                </li>
            }
        </ul>
    `,
    styleUrl: './home-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
    protected readonly cities = inject(CatalogStore).cities;
}
