import { NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    signal,
    untracked,
} from '@angular/core';

import { FavoritesStore } from '@features/toggle-favorite/model/favorites.store';

import {
    DEFAULT_STUDIO_FILTERS,
    type StudioFilters,
    filterStudios,
    sameStudioFilters,
} from '@entities/studio/model/studio-filters';
import { DEMO_STUDIOS } from '@entities/studio/model/studios.demo';
import { StudioCardComponent } from '@entities/studio/ui/studio-card/studio-card.component';
import { StudioListComponent } from '@entities/studio/ui/studio-list/studio-list.component';

import { AnalyticsService } from '@shared/lib/analytics/analytics.service';
import { AutofocusDirective } from '@shared/lib/autofocus/autofocus.directive';
import type { Studio } from '@shared/model';
import { SpinnerComponent } from '@shared/ui/spinner/spinner.component';

/** Состояние, которое показываем кнопками демо — пока нет настоящей загрузки (модуль 06) */
type DemoState = 'loading' | 'error' | 'empty' | 'data';

@Component({
    selector: 'app-catalog-page',
    imports: [
        AutofocusDirective,
        NgTemplateOutlet,
        SpinnerComponent,
        StudioCardComponent,
        StudioListComponent,
    ],
    templateUrl: './catalog-page.component.html',
    styleUrl: './catalog-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogPageComponent {
    protected readonly loading = signal(false);
    protected readonly error = signal<string | null>(null);
    protected readonly studios = signal<Studio[]>(DEMO_STUDIOS);
    /** Избранное живёт в сторе: его видит и шапка, и оно переживает переход между страницами */
    protected readonly favoritesStore = inject(FavoritesStore);
    /** Строка поиска — сигнал: шаблон, который её читает, обновится сам */
    protected readonly query = signal('');

    /** equal: новый, но такой же по содержанию объект не пересчитает каталог и не запустит эффект */
    protected readonly filters = signal<StudioFilters>(DEFAULT_STUDIO_FILTERS, {
        equal: sameStudioFilters,
    });

    private readonly analytics = inject(AnalyticsService);

    protected readonly demoStates: { value: DemoState; label: string }[] = [
        { value: 'loading', label: 'Загрузка' },
        { value: 'error', label: 'Ошибка' },
        { value: 'empty', label: 'Пусто' },
        { value: 'data', label: 'Данные' },
    ];

    /** Первая студия из подборки «Рекомендуем»; может не найтись — тип Studio | undefined */
    protected readonly featured = computed(() => this.studios().find((studio) => studio.featured));

    /** Города для фильтра — из самих данных, без повторов */
    protected readonly cities = computed(() =>
        [...new Set(this.studios().map((studio) => studio.city))].sort(),
    );

    /** Зависимости — studios, query и filters: computed запомнил их сам */
    protected readonly filtered = computed(() =>
        filterStudios(this.studios(), this.query(), this.filters()),
    );

    /** computed от computed: граф query/studios → filtered → count */
    protected readonly count = computed(() => this.filtered().length);

    constructor() {
        // Аналитика поиска: перезапуск — только при смене query или filters
        effect(() => {
            const query = this.query().trim();
            const { city, onlyOpen } = this.filters();
            // Размер избранного читаем без подписки: клик по сердечку не должен слать событие поиска
            const favorites = untracked(() => this.favoritesStore.favorites().size);
            this.analytics.track('catalog_search', { query, city, onlyOpen, favorites });
        });
    }

    protected setCity(city: string): void {
        this.filters.update((filters) => ({ ...filters, city }));
    }

    protected setOnlyOpen(onlyOpen: boolean): void {
        this.filters.update((filters) => ({ ...filters, onlyOpen }));
    }

    /** Новый объект с теми же значениями: при уже сброшенных фильтрах equal ничего не запустит */
    protected resetFilters(): void {
        this.filters.set({ ...DEFAULT_STUDIO_FILTERS });
    }

    protected showState(state: DemoState): void {
        this.loading.set(state === 'loading');
        this.error.set(state === 'error' ? 'Сервер не ответил' : null);
        this.studios.set(state === 'data' ? DEMO_STUDIOS : []);
    }

    /** Тот же набор студий в обратном порядке: с track studio.id элементы переставляются, а не создаются */
    protected reverse(): void {
        this.studios.update((studios) => [...studios].reverse());
    }

    /** Новые объекты с теми же id — как ответ сервера: с track studio.id DOM переиспользуется */
    protected refresh(): void {
        this.studios.update((studios) => studios.map((studio) => ({ ...studio })));
    }
}
