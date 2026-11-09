import { PluralPipe } from './plural.pipe';

describe('PluralPipe', () => {
    const pipe = new PluralPipe();
    const hours = ['час', 'часа', 'часов'] as const;

    it.each([
        [1, '1 час'],
        [2, '2 часа'],
        [5, '5 часов'],
        [11, '11 часов'],
        [21, '21 час'],
        [24, '24 часа'],
    ])('%i → «%s»', (count, expected) => {
        expect(pipe.transform(count, hours)).toBe(expected);
    });
});
