import { type Observable, fromEvent, map, merge, of } from 'rxjs';

/**
 * Есть ли сеть: текущее значение сразу, дальше — каждое изменение.
 * merge сливает несколько потоков в один: значения идут в порядке появления
 */
export function online$(window: Window): Observable<boolean> {
    return merge(
        of(window.navigator.onLine),
        fromEvent(window, 'online').pipe(map(() => true)),
        fromEvent(window, 'offline').pipe(map(() => false)),
    );
}
