import type { Studio } from '@shared/model';

/** Фильтры каталога. city: '' — любой город */
export interface StudioFilters {
    readonly city: string;
    readonly onlyOpen: boolean;
}

export const DEFAULT_STUDIO_FILTERS: StudioFilters = { city: '', onlyOpen: false };

/** Равны по содержанию — для signal({ equal }): новый, но такой же объект не будит зависимых */
export function sameStudioFilters(a: StudioFilters, b: StudioFilters): boolean {
    return a.city === b.city && a.onlyOpen === b.onlyOpen;
}

/** Чистая функция: легко тестировать отдельно от компонента */
export function filterStudios(studios: Studio[], query: string, filters: StudioFilters): Studio[] {
    const q = query.trim().toLowerCase();
    return studios.filter(
        (studio) =>
            (!q ||
                studio.name.toLowerCase().includes(q) ||
                studio.city.toLowerCase().includes(q)) &&
            (!filters.city || studio.city === filters.city) &&
            (!filters.onlyOpen || studio.isOpen),
    );
}
