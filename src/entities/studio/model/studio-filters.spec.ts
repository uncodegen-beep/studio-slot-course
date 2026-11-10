import { DEFAULT_STUDIO_FILTERS, filterStudios, sameStudioFilters } from './studio-filters';
import { DEMO_STUDIOS } from './studios.demo';

describe('studio-filters', () => {
    it('sameStudioFilters сравнивает по содержанию, а не по ссылке', () => {
        expect(sameStudioFilters(DEFAULT_STUDIO_FILTERS, { ...DEFAULT_STUDIO_FILTERS })).toBe(true);
        expect(sameStudioFilters(DEFAULT_STUDIO_FILTERS, { city: 'Казань', onlyOpen: false })).toBe(
            false,
        );
    });

    it('filterStudios учитывает поиск, город и «только открытые»', () => {
        const names = (query: string, city = '', onlyOpen = false): string[] =>
            filterStudios(DEMO_STUDIOS, query, { city, onlyOpen }).map((studio) => studio.name);

        expect(names('')).toHaveLength(DEMO_STUDIOS.length);
        expect(names('  SOUND ')).toEqual(['Sound Garden']);
        expect(names('', 'Казань')).toEqual(['Volga Records']);
        expect(names('', '', true)).not.toContain('Volga Records');
    });
});
