import {
    DEFAULT_STUDIO_FILTERS,
    type StudioFilters,
    filterStudios,
    sameStudioFilters,
} from './studio-filters';
import { DEMO_STUDIOS } from './studios.demo';

describe('studio-filters', () => {
    it('sameStudioFilters сравнивает по содержанию, а не по ссылке', () => {
        expect(sameStudioFilters(DEFAULT_STUDIO_FILTERS, { ...DEFAULT_STUDIO_FILTERS })).toBe(true);
        const changed = (change: Partial<StudioFilters>): StudioFilters => ({
            ...DEFAULT_STUDIO_FILTERS,
            ...change,
        });

        expect(sameStudioFilters(DEFAULT_STUDIO_FILTERS, changed({ city: 'Казань' }))).toBe(false);
        // 0 — не «не выбрано»: null и 0 различаются
        expect(sameStudioFilters(DEFAULT_STUDIO_FILTERS, changed({ maxPrice: 0 }))).toBe(false);
    });

    it('filterStudios учитывает поиск, город и «только открытые»', () => {
        const names = (query: string, city = '', onlyOpen = false): string[] =>
            filterStudios(DEMO_STUDIOS, query, { city, onlyOpen, maxPrice: null }).map(
                (studio) => studio.name,
            );

        expect(names('')).toHaveLength(DEMO_STUDIOS.length);
        expect(names('  SOUND ')).toEqual(['Sound Garden']);
        expect(names('', 'Казань')).toEqual(['Volga Records']);
        expect(names('', '', true)).not.toContain('Volga Records');
    });

    it('цена до: достаточно одного подходящего зала', () => {
        const names = (maxPrice: number): string[] =>
            filterStudios(DEMO_STUDIOS, '', { city: '', onlyOpen: false, maxPrice }).map(
                (studio) => studio.name,
            );

        // у Sound Garden залы 1500, 2200, 1800 — подходит первый
        expect(names(1500)).toContain('Sound Garden');
        expect(names(1300)).toEqual(['Nevsky Beat', 'Volga Records']);
        expect(names(800)).toEqual([]);
    });
});
