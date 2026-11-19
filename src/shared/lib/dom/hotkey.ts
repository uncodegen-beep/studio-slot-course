import { type Observable, filter, fromEvent, tap } from 'rxjs';

/** В полях ввода клавиши — обычные символы, перехватывать их нельзя */
export function isTypingTarget(target: EventTarget | null): boolean {
    return (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable)
    );
}

/**
 * Поток нажатий одной клавиши вне полей ввода.
 * Вся логика — операторами в pipe: подписчику остаётся только действие
 */
export function hotkey(document: Document, key: string): Observable<KeyboardEvent> {
    return fromEvent<KeyboardEvent>(document, 'keydown').pipe(
        // filter пропускает дальше только подходящие события
        filter(
            (event) =>
                event.key === key &&
                !event.ctrlKey &&
                !event.metaKey &&
                !event.altKey &&
                !isTypingTarget(event.target),
        ),
        // tap — побочный эффект без изменения значения: браузер не напечатает «/»
        tap((event) => event.preventDefault()),
    );
}
