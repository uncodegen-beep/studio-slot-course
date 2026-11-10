import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { useInterval } from '@shared/lib/interval/use-interval';

/** Текущее время, обновляется раз в секунду */
@Component({
    selector: 'app-clock',
    imports: [DatePipe],
    template: `<time [attr.datetime]="now().toISOString()">{{ now() | date: 'HH:mm:ss' }}</time>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClockComponent {
    /** Сигнал вместо поля: set() сам планирует обновление шаблона — markForCheck больше не нужен */
    protected readonly now = signal(new Date());

    constructor() {
        // Очистка — рядом с подпиской, а не в ngOnDestroy в конце класса
        useInterval(() => this.now.set(new Date()), 1000);
    }
}
