import { Injectable, signal } from '@angular/core';

/**
 * Черновик бронирования одной панели. Без providedIn: экземпляр создаёт тот компонент,
 * у которого стор указан в providers, — и уничтожает вместе с собой
 */
@Injectable()
export class BookingDraftStore {
    readonly hours = signal(2);
    readonly startHour = signal(12);
}
