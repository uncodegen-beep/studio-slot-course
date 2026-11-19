import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

import { map, timer } from 'rxjs';

/** Текущее время, обновляется раз в секунду */
@Component({
    selector: 'app-clock',
    imports: [DatePipe],
    template: `<time [attr.datetime]="now().toISOString()">{{ now() | date: 'HH:mm:ss' }}</time>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClockComponent {
    protected readonly now = signal(new Date());

    constructor() {
        // timer даёт номера 0, 1, 2…; map превращает номер в текущее время
        const subscription = timer(0, 1000)
            .pipe(map(() => new Date()))
            .subscribe((now) => this.now.set(now));
        inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
    }
}
