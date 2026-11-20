// Задание модуля 05: автосохранение черновика без дублей и гонок запросов.
// Оператор описан интерфейсом ниже: тест компилируется, но падает, пока его не сделать.
import { type Observable, type OperatorFunction, Subject, map, throwError, timer } from 'rxjs';

import * as autosaveModule from '../../src/shared/lib/rx/autosave';

type AutosaveStatus = autosaveModule.AutosaveStatus;

interface AutosaveTask {
    /**
     * Поток изменений → поток статусов. Сохраняет после паузы, не сохраняет то же самое дважды,
     * сохранения идут строго по очереди, ошибка одного сохранения не ломает следующие
     */
    autosave<T>(
        save: (value: T) => Observable<unknown>,
        options?: autosaveModule.AutosaveOptions<T>,
    ): OperatorFunction<T, AutosaveStatus>;
}

const task = autosaveModule as unknown as Partial<AutosaveTask>;

/**
 * «Сервер»: сохранение длится 500 мс, а «первая» — 2000 мс, чтобы проверить гонку.
 * В saved — что и на какой миллисекунде сохранилось
 */
function setup(fail: (value: string) => boolean = () => false): {
    edits: Subject<string>;
    saved: string[];
    statuses: AutosaveStatus[];
} {
    const start = Date.now();
    const edits = new Subject<string>();
    const saved: string[] = [];
    const statuses: AutosaveStatus[] = [];
    const save = (value: string): Observable<unknown> =>
        fail(value)
            ? throwError(() => new Error('Сервер недоступен'))
            : timer(value === 'первая' ? 2000 : 500).pipe(
                  map(() => saved.push(`${value}@${Date.now() - start}`)),
              );

    edits
        .pipe(task.autosave?.(save, { debounceMs: 1000 }) ?? map(() => 'error' as const))
        .subscribe((status) => statuses.push(status));
    return { edits, saved, statuses };
}

describe('Модуль 05 · autosave', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('оператор autosave экспортирован из shared/lib/rx/autosave.ts', () => {
        expect(typeof task.autosave).toBe('function');
    });

    it('серия правок — одно сохранение последнего значения после паузы', () => {
        const { edits, saved, statuses } = setup();

        edits.next('Б');
        vi.advanceTimersByTime(300);
        edits.next('Бо');
        vi.advanceTimersByTime(300);
        edits.next('Большой зал');
        vi.advanceTimersByTime(1000);
        expect(statuses).toEqual(['saving']);

        vi.advanceTimersByTime(500);
        expect(saved).toEqual(['Большой зал@2100']);
        expect(statuses).toEqual(['saving', 'saved']);
    });

    it('то же значение второй раз не сохраняется', () => {
        const { edits, saved } = setup();

        edits.next('Зал');
        vi.advanceTimersByTime(2000);
        edits.next('Зал!');
        edits.next('Зал');
        vi.advanceTimersByTime(2000);

        expect(saved).toHaveLength(1);
    });

    it('без гонок: правка во время сохранения ждёт своей очереди', () => {
        const { edits, saved } = setup();

        edits.next('первая');
        vi.advanceTimersByTime(1200);
        // первая сохраняется до 3000 мс — вторая не должна ни отменить её, ни обогнать
        edits.next('вторая');
        vi.advanceTimersByTime(3000);

        expect(saved.map((entry) => entry.split('@')[0])).toEqual(['первая', 'вторая']);
    });

    it('ошибка — статус error, следующие правки сохраняются', () => {
        const { edits, saved, statuses } = setup((value) => value === 'сбой');

        edits.next('сбой');
        vi.advanceTimersByTime(1000);
        edits.next('после сбоя');
        vi.advanceTimersByTime(2000);

        expect(statuses).toEqual(['saving', 'error', 'saving', 'saved']);
        expect(saved.map((entry) => entry.split('@')[0])).toEqual(['после сбоя']);
    });
});
