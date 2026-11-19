import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

export interface Notice {
    readonly text: string;
}

/**
 * Шина уведомлений: кто угодно сообщает, тост показывает.
 * Subject — и источник (next), и Observable. Наружу отдаём только Observable:
 * слать события может лишь этот сервис
 */
@Injectable({ providedIn: 'root' })
export class NotifierService {
    private readonly notices = new Subject<Notice>();

    readonly notices$ = this.notices.asObservable();

    notify(text: string): void {
        this.notices.next({ text });
    }
}
