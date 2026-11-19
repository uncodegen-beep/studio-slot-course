import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

import { ticks } from '@shared/lib/time/ticks';

/** Текущее время, обновляется раз в секунду */
@Component({
    selector: 'app-clock',
    imports: [DatePipe],
    template: `<time [attr.datetime]="now().toISOString()">{{ now() | date: 'HH:mm:ss' }}</time>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClockComponent {
    /** Сигнал для шаблона, Observable — источник событий во времени */
    protected readonly now = signal(new Date());

    constructor() {
        const subscription = ticks(1000).subscribe((now) => this.now.set(now));
        // Подписался — отпишись: компонент уничтожен, таймер должен остановиться
        inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
    }
}
