import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
        // takeUntilDestroyed: поток завершится вместе с компонентом — отписка без DestroyRef руками
        timer(0, 1000)
            .pipe(
                map(() => new Date()),
                takeUntilDestroyed(),
            )
            .subscribe((now) => this.now.set(now));
    }
}
