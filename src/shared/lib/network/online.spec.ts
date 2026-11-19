import { combineLatest, forkJoin, of, zip } from 'rxjs';

import { online$ } from './online';

describe('online$', () => {
    it('merge: сначала текущее состояние, потом события online/offline', () => {
        const states: boolean[] = [];
        const subscription = online$(window).subscribe((online) => states.push(online));

        window.dispatchEvent(new Event('offline'));
        window.dispatchEvent(new Event('online'));
        subscription.unsubscribe();

        expect(states).toEqual([navigator.onLine, false, true]);
    });
});

describe('комбинирование: шпаргалка в тестах', () => {
    it('forkJoin — последние значения всех, когда все завершились', () => {
        let result: unknown;
        forkJoin([of(1, 2), of('a')]).subscribe((value) => (result = value));

        expect(result).toEqual([2, 'a']);
    });

    it('forkJoin([]) завершается без значений — пустой список проверяем сами', () => {
        const values: unknown[] = [];
        forkJoin([]).subscribe((value) => values.push(value));

        expect(values).toEqual([]);
    });

    it('combineLatest — при каждом новом значении, когда у всех уже есть хотя бы одно', () => {
        const values: string[] = [];
        combineLatest([of(1, 2), of('a')]).subscribe(([n, s]) => values.push(`${n}${s}`));

        expect(values).toEqual(['2a']);
    });

    it('zip — пары по порядку: первое с первым, второе со вторым', () => {
        const values: string[] = [];
        zip([of(1, 2, 3), of('a', 'b')]).subscribe(([n, s]) => values.push(`${n}${s}`));

        expect(values).toEqual(['1a', '2b']);
    });
});
