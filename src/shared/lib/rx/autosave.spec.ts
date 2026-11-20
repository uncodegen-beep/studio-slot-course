import { Subject, throwError, timer } from 'rxjs';

import { type AutosaveStatus, autosave } from './autosave';

describe('autosave', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('isEqual: свои правила сравнения — например, без учёта пробелов по краям', () => {
        const edits = new Subject<string>();
        const saves: string[] = [];
        edits
            .pipe(
                autosave(
                    (value) => {
                        saves.push(value);
                        return timer(100);
                    },
                    { debounceMs: 500, isEqual: (a, b) => a.trim() === b.trim() },
                ),
            )
            .subscribe();

        edits.next('Зал');
        vi.advanceTimersByTime(1000);
        edits.next('  Зал  ');
        vi.advanceTimersByTime(1000);

        expect(saves).toEqual(['Зал']);
    });

    it('ответ сервера не важен — после ошибки поток продолжает работать', () => {
        const edits = new Subject<number>();
        const statuses: AutosaveStatus[] = [];
        edits
            .pipe(autosave((value) => (value < 0 ? throwError(() => new Error()) : timer(10))))
            .subscribe((status) => statuses.push(status));

        edits.next(-1);
        vi.advanceTimersByTime(1000);
        edits.next(1);
        vi.advanceTimersByTime(1010);

        expect(statuses).toEqual(['saving', 'error', 'saving', 'saved']);
    });
});
