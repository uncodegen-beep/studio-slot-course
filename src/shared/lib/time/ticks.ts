import { Observable } from 'rxjs';

/**
 * Поток текущего времени раз в ms миллисекунд — Observable, написанный руками.
 * Функция внутри запускается заново на каждую подписку (холодный поток),
 * а возвращённая функция очистки срабатывает при отписке
 */
export function ticks(ms: number): Observable<Date> {
    return new Observable<Date>((subscriber) => {
        const id = setInterval(() => subscriber.next(new Date()), ms);

        // Без этого таймер жил бы и после unsubscribe — утечка
        return () => clearInterval(id);
    });
}
