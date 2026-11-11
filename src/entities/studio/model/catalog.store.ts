import { Injectable, computed, signal } from '@angular/core';

import type { Studio } from '@shared/model';

import {
    DEFAULT_STUDIO_FILTERS,
    type StudioFilters,
    filterStudios,
    sameStudioFilters,
} from './studio-filters';
import { DEMO_STUDIOS } from './studios.demo';

interface CatalogState {
    readonly studios: Studio[];
    readonly query: string;
    readonly filters: StudioFilters;
}

/**
 * Состояние каталога — один сигнал-объект. Наружу: computed для чтения и методы для изменения.
 * Компоненты больше не фильтруют сами — только читают сигналы и вызывают методы
 */
@Injectable({ providedIn: 'root' })
export class CatalogStore {
    private readonly state = signal<CatalogState>({
        studios: DEMO_STUDIOS,
        query: '',
        filters: DEFAULT_STUDIO_FILTERS,
    });

    readonly studios = computed(() => this.state().studios);
    readonly query = computed(() => this.state().query);
    /** equal на computed: равные по содержанию фильтры не будят зависимых */
    readonly filters = computed(() => this.state().filters, { equal: sameStudioFilters });

    readonly featured = computed(() => this.studios().find((studio) => studio.featured));
    readonly cities = computed(() =>
        [...new Set(this.studios().map((studio) => studio.city))].sort(),
    );
    readonly filtered = computed(() => filterStudios(this.studios(), this.query(), this.filters()));
    readonly count = computed(() => this.filtered().length);

    /** Изменены ли фильтры — из того же сигнала, без отдельного флага и effect */
    readonly isDirty = computed(() => !sameStudioFilters(this.filters(), DEFAULT_STUDIO_FILTERS));

    setStudios(studios: Studio[]): void {
        this.state.update((state) => ({ ...state, studios }));
    }

    setQuery(query: string): void {
        this.state.update((state) => ({ ...state, query }));
    }

    setCity(city: string): void {
        this.patchFilters({ city });
    }

    setOnlyOpen(onlyOpen: boolean): void {
        this.patchFilters({ onlyOpen });
    }

    setMaxPrice(maxPrice: number | null): void {
        this.patchFilters({ maxPrice });
    }

    resetFilters(): void {
        this.state.update((state) => ({ ...state, filters: { ...DEFAULT_STUDIO_FILTERS } }));
    }

    /** Тот же набор в обратном порядке — демо track из урока 13 */
    reverse(): void {
        this.setStudios([...this.studios()].reverse());
    }

    /** Новые объекты с теми же id — как ответ сервера */
    refresh(): void {
        this.setStudios(this.studios().map((studio) => ({ ...studio })));
    }

    private patchFilters(change: Partial<StudioFilters>): void {
        this.state.update((state) => ({ ...state, filters: { ...state.filters, ...change } }));
    }
}
