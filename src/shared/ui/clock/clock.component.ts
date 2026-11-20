import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { map, timer } from 'rxjs';

/** Текущее время, обновляется раз в секунду */
@Component({
    selector: 'app-clock',
    imports: [DatePipe],
    template: `<time [attr.datetime]="now().toISOString()">{{ now() | date: 'HH:mm:ss' }}</time>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClockComponent {
    /**
     * toSignal: подписка на поток и сигнал с последним значением.
     * Отписка — сама, при уничтожении компонента. initialValue — значение до первого тика
     */
    protected readonly now = toSignal(timer(0, 1000).pipe(map(() => new Date())), {
        initialValue: new Date(),
    });
}
