import {
    type Observable,
    type OperatorFunction,
    catchError,
    concat,
    concatMap,
    debounceTime,
    distinctUntilChanged,
    endWith,
    ignoreElements,
    of,
} from 'rxjs';

/** Что показать пользователю рядом с полем: «Сохраняем…», «Сохранено», «Не удалось сохранить» */
export type AutosaveStatus = 'saving' | 'saved' | 'error';

export interface AutosaveOptions<T> {
    /** Пауза после последнего изменения, прежде чем сохранять. По умолчанию 1000 мс */
    readonly debounceMs?: number;
    /** Как сравнивать значения, чтобы не сохранять то же самое дважды. По умолчанию Object.is */
    readonly isEqual?: (previous: T, current: T) => boolean;
}

/**
 * Поток изменений → поток статусов сохранения. Свой оператор — функция, которая собирает
 * готовые: каждый отвечает за одно правило
 */
export function autosave<T>(
    save: (value: T) => Observable<unknown>,
    { debounceMs = 1000, isEqual = Object.is }: AutosaveOptions<T> = {},
): OperatorFunction<T, AutosaveStatus> {
    return (changes$) =>
        changes$.pipe(
            // Без дублей №1: пока печатают — не сохраняем
            debounceTime(debounceMs),
            // Без дублей №2: то же значение, что в прошлый раз, — не сохраняем
            distinctUntilChanged(isEqual),
            // Без гонок: сохранения строго по очереди. switchMap отменил бы запрос в пути,
            // но сервер мог его уже применить; mergeMap дал бы старому ответу обогнать новый
            concatMap((value) =>
                concat(
                    of<AutosaveStatus>('saving'),
                    save(value).pipe(
                        // Что вернул сервер, не важно — важно, что сохранение завершилось
                        ignoreElements(),
                        endWith<AutosaveStatus>('saved'),
                        // Ошибка гасит только это сохранение: поток живёт дальше
                        catchError(() => of<AutosaveStatus>('error')),
                    ),
                ),
            ),
        );
}
