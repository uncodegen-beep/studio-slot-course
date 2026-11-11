import { CurrencyPipe, NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    effect,
    inject,
    linkedSignal,
    signal,
    untracked,
    viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { createSlotPrice } from '@features/book-slot/model/slot-price';
import { FavoritesStore } from '@features/toggle-favorite/model/favorites.store';

import { CatalogStore } from '@entities/studio/model/catalog.store';
import { DEMO_STUDIOS } from '@entities/studio/model/studios.demo';
import { StudioCardComponent } from '@entities/studio/ui/studio-card/studio-card.component';
import { StudioListComponent } from '@entities/studio/ui/studio-list/studio-list.component';

import { AnalyticsService } from '@shared/lib/analytics/analytics.service';
import { AutofocusDirective } from '@shared/lib/autofocus/autofocus.directive';
import { PluralPipe } from '@shared/lib/plural/plural.pipe';
import type { StudioRoom } from '@shared/model';
import { DurationPickerComponent } from '@shared/ui/duration-picker/duration-picker.component';
import { SpinnerComponent } from '@shared/ui/spinner/spinner.component';

/** Состояние, которое показываем кнопками демо — пока нет настоящей загрузки (модуль 06) */
type DemoState = 'loading' | 'error' | 'empty' | 'data';

@Component({
    selector: 'app-catalog-page',
    imports: [
        AutofocusDirective,
        CurrencyPipe,
        DurationPickerComponent,
        NgTemplateOutlet,
        PluralPipe,
        RouterLink,
        SpinnerComponent,
        StudioCardComponent,
        StudioListComponent,
    ],
    templateUrl: './catalog-page.component.html',
    styleUrl: './catalog-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        // Горячая клавиша «/» — как поиск на GitHub и YouTube
        '(document:keydown)': 'onKeydown($event)',
    },
})
export class CatalogPageComponent {
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
    protected readonly featured = this.store.featured;

    /** Избранное живёт в сторе: его видит и шапка, и оно переживает переход между страницами */
    protected readonly favoritesStore = inject(FavoritesStore);

    private readonly analytics = inject(AnalyticsService);
    /** Сигнальный запрос к своему шаблону: #queryInput. required — поле есть всегда */
    private readonly searchInput = viewChild.required<ElementRef<HTMLInputElement>>('queryInput');

    protected readonly demoStates: { value: DemoState; label: string }[] = [
        { value: 'loading', label: 'Загрузка' },
        { value: 'error', label: 'Ошибка' },
        { value: 'empty', label: 'Пусто' },
        { value: 'data', label: 'Данные' },
    ];

    /**
     * Выбранный зал рекомендуемой студии. linkedSignal: пользователь выбирает вручную (set),
     * а при смене списка залов выбор пересчитывается: тот же зал, если он ещё есть, иначе первый
     */
    protected readonly selectedRoom = linkedSignal<readonly StudioRoom[], StudioRoom | null>({
        source: () => this.featured()?.rooms ?? [],
        computation: (rooms, previous) =>
            rooms.find((room) => room.id === previous?.value?.id) ?? rooms[0] ?? null,
    });

    /** Длительность сессии: меняет её пикер через [(value)] */
    protected readonly hours = signal(2);
    /** Начало сессии, час: вечером тариф выше */
    protected readonly startHour = signal(12);
    protected readonly startHours = [10, 12, 14, 16, 18, 20] as const;
    /** Цена слота — фабрика из сигналов: зал, часы и начало */
    protected readonly price = createSlotPrice(this.selectedRoom, this.hours, this.startHour);

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

    protected onKeydown(event: KeyboardEvent): void {
        const target = event.target as HTMLElement | null;
        const typing =
            target instanceof HTMLInputElement ||
            target instanceof HTMLTextAreaElement ||
            target instanceof HTMLSelectElement;
        // В поле ввода «/» — обычный символ, перехватывать нельзя
        if (event.key === '/' && !typing) {
            event.preventDefault();
            this.searchInput().nativeElement.focus();
        }
    }

    protected showState(state: DemoState): void {
        this.loading.set(state === 'loading');
        this.error.set(state === 'error' ? 'Сервер не ответил' : null);
        this.store.setStudios(state === 'data' ? DEMO_STUDIOS : []);
    }
}
