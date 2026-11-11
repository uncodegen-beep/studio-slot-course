import type { Studio } from '@shared/model';

/** Фильтры каталога. city: '' — любой город, maxPrice: null — любая цена */
export interface StudioFilters {
    readonly city: string;
    readonly onlyOpen: boolean;
    /** null, а не 0: ноль — допустимое значение, его нельзя путать с «не выбрано» */
    readonly maxPrice: number | null;
}

export const DEFAULT_STUDIO_FILTERS: StudioFilters = { city: '', onlyOpen: false, maxPrice: null };

/** Равны по содержанию — для signal({ equal }): новый, но такой же объект не будит зависимых */
export function sameStudioFilters(a: StudioFilters, b: StudioFilters): boolean {
    return a.city === b.city && a.onlyOpen === b.onlyOpen && a.maxPrice === b.maxPrice;
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
            (!filters.onlyOpen || studio.isOpen) &&
            fitsPrice(studio, filters.maxPrice),
    );
}

/** Подходит, если ХОТЯ БЫ ОДИН зал не дороже; залов нет — сравниваем цену студии */
function fitsPrice(studio: Studio, maxPrice: number | null): boolean {
    if (maxPrice === null) {
        return true;
    }
    const prices = studio.rooms?.map((room) => room.pricePerHour) ?? [studio.pricePerHour];
    return prices.some((price) => price <= maxPrice);
}
