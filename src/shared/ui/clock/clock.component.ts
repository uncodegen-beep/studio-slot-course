import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';

import { useInterval } from '@shared/lib/interval/use-interval';

/** Текущее время, обновляется раз в секунду */
@Component({
    selector: 'app-clock',
    imports: [DatePipe],
    template: `<time [attr.datetime]="now.toISOString()">{{ now | date: 'HH:mm:ss' }}</time>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClockComponent {
    protected now = new Date();

    constructor() {
        const cdr = inject(ChangeDetectorRef);
        // Очистка — рядом с подпиской, а не в ngOnDestroy в конце класса
        useInterval(() => {
            this.now = new Date();
            // Без zone.js таймер не запускает проверку: просим Angular перерисовать компонент.
            // В модуле 02 поле станет сигналом, и вызов не понадобится
            cdr.markForCheck();
        }, 1000);
    }
}
