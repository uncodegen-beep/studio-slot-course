import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

import { timer } from 'rxjs';

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
        // timer(0, 1000): первое значение сразу, дальше раз в секунду. Заменил самописный ticks()
        const subscription = timer(0, 1000).subscribe(() => this.now.set(new Date()));
        inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
    }
}
