// Шпаргалка Шп-06 в тестах: что делают четыре оператора высшего порядка,
// когда новое значение приходит, пока предыдущий внутренний поток ещё идёт.
// Клики a, b, c — в 0, 100 и 200 мс; каждый «запрос» длится 300 мс.
// Запись «b@400» — ответ на клик b пришёл на 400-й миллисекунде.
import {
    type Observable,
    type OperatorFunction,
    concatMap,
    exhaustMap,
    map,
    mergeMap,
    switchMap,
    take,
    timer,
} from 'rxjs';

/** «Запрос» на клик: ответ через 300 мс */
const request = (click: string): Observable<string> => timer(300).pipe(map(() => click));

function run(operator: OperatorFunction<string, string>): string[] {
    const start = Date.now();
    const answers: string[] = [];
    const clicks$ = timer(0, 100).pipe(
        take(3),
        map((index) => ['a', 'b', 'c'][index] ?? '?'),
    );

    clicks$.pipe(operator).subscribe((click) => answers.push(`${click}@${Date.now() - start}`));
    vi.advanceTimersByTime(2000);

    return answers;
}

describe('операторы высшего порядка', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('mergeMap — все параллельно', () => {
        expect(run(mergeMap(request))).toEqual(['a@300', 'b@400', 'c@500']);
    });

    it('concatMap — по очереди, ничего не теряется', () => {
        expect(run(concatMap(request))).toEqual(['a@300', 'b@600', 'c@900']);
    });

    it('switchMap — только последний, прошлые отменены', () => {
        expect(run(switchMap(request))).toEqual(['c@500']);
    });

    it('exhaustMap — только первый, пока он идёт, новые игнорируются', () => {
        expect(run(exhaustMap(request))).toEqual(['a@300']);
    });
});
