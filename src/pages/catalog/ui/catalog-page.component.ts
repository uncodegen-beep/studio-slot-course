import { CurrencyPipe, DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    booleanAttribute,
    effect,
    inject,
    input,
    signal,
    untracked,
    viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';

import { BookingPanelComponent } from '@features/book-slot/ui/booking-panel/booking-panel.component';
import { FavoritesStore } from '@features/toggle-favorite/model/favorites.store';

import { CatalogStore } from '@entities/studio/model/catalog.store';
import { DEMO_STUDIOS } from '@entities/studio/model/studios.demo';
import { StudioCardComponent } from '@entities/studio/ui/studio-card/studio-card.component';
import { StudioListComponent } from '@entities/studio/ui/studio-list/studio-list.component';

import { AnalyticsService } from '@shared/lib/analytics/analytics.service';
import { AutofocusDirective } from '@shared/lib/autofocus/autofocus.directive';
import { hotkey } from '@shared/lib/dom/hotkey';
import { FieldGroupComponent } from '@shared/ui/field-group/field-group.component';
import { SpinnerComponent } from '@shared/ui/spinner/spinner.component';

/** ?onlyOpen=true → true. Параметра нет — undefined: фильтр в сторе не трогаем */
function optionalBoolean(value: string | boolean | undefined): boolean | undefined {
    return value === undefined ? undefined : booleanAttribute(value);
}

/** Состояние, которое показываем кнопками демо — пока нет настоящей загрузки (модуль 06) */
type DemoState = 'loading' | 'error' | 'empty' | 'data';

@Component({
    selector: 'app-catalog-page',
    imports: [
        AutofocusDirective,
        BookingPanelComponent,
        CurrencyPipe,
        FieldGroupComponent,
        NgTemplateOutlet,
        RouterLink,
        SpinnerComponent,
        StudioCardComponent,
        StudioListComponent,
    ],
    templateUrl: './catalog-page.component.html',
    styleUrl: './catalog-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogPageComponent {
    /**
     * Query-параметры адреса — входы страницы (withComponentInputBinding):
     * /studios?city=Казань&onlyOpen=true. Имя входа = имя параметра
     */
    readonly city = input<string>();
    readonly onlyOpen = input<boolean | undefined, string | boolean | undefined>(undefined, {
        transform: optionalBoolean,
    });

    protected readonly loading = signal(false);
    protected readonly error = signal<string | null>(null);

    /** Состояние каталога — в сторе: страница только читает сигналы и вызывает методы */
    protected readonly store = inject(CatalogStore);
    protected readonly studios = this.store.studios;
    protected readonly query = this.store.query;
    protected readonly filters = this.store.filters;
    protected readonly cities = this.store.cities;
    protected readonly filtered = this.store.filtered;
    protected readonly count = this.store.count;
    protected readonly isDirty = this.store.isDirty;
    /** Варианты «цена до»; null — любая */
    protected readonly priceOptions = [null, 1000, 1500, 2000] as const;
    protected readonly featured = this.store.featured;

    /** Избранное живёт в сторе: его видит и шапка, и оно переживает переход между страницами */
    protected readonly favoritesStore = inject(FavoritesStore);

    private readonly analytics = inject(AnalyticsService);
    private readonly router = inject(Router);
    /** Сигнальный запрос к своему шаблону: #queryInput. required — поле есть всегда */
    private readonly searchInput = viewChild.required<ElementRef<HTMLInputElement>>('queryInput');

    protected readonly demoStates: { value: DemoState; label: string }[] = [
        { value: 'loading', label: 'Загрузка' },
        { value: 'error', label: 'Ошибка' },
        { value: 'empty', label: 'Пусто' },
        { value: 'data', label: 'Данные' },
    ];

    constructor() {
        // Горячая клавиша «/» — как поиск на GitHub и YouTube. Фильтр и preventDefault — внутри hotkey()
        hotkey(inject(DOCUMENT), '/')
            .pipe(takeUntilDestroyed())
            .subscribe(() => this.searchInput().nativeElement.focus());

        // Адрес → фильтры. Ссылка «/studios?onlyOpen=true» открывает каталог уже отфильтрованным
        effect(() => {
            const city = this.city();
            const onlyOpen = this.onlyOpen();
            untracked(() => {
                if (city !== undefined) {
                    this.store.setCity(city);
                }
                if (onlyOpen !== undefined) {
                    this.store.setOnlyOpen(onlyOpen);
                }
            });
        });

        // Аналитика поиска: перезапуск — только при смене query или filters
        effect(() => {
            const query = this.query().trim();
            const { city, onlyOpen } = this.filters();
            // Размер избранного читаем без подписки: клик по сердечку не должен слать событие поиска
            const favorites = untracked(() => this.favoritesStore.favorites().size);
            this.analytics.track('catalog_search', { query, city, onlyOpen, favorites });
        });
    }

    /** Переход из кода — после действия пользователя. Сегменты массивом: id экранирует сам роутер */
    protected openStudio(id: string): void {
        void this.router.navigate(['/studios', id]);
    }

    protected setMaxPrice(value: string): void {
        this.store.setMaxPrice(value === '' ? null : Number(value));
    }

    protected showState(state: DemoState): void {
        this.loading.set(state === 'loading');
        this.error.set(state === 'error' ? 'Сервер не ответил' : null);
        this.store.setStudios(state === 'data' ? DEMO_STUDIOS : []);
    }
}
