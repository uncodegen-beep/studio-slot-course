import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { concat, map, of, switchMap, timer } from 'rxjs';

import { type Notice, NotifierService } from '@shared/lib/notify/notifier.service';

export const TOAST_MS = 3000;

/** Последнее уведомление на TOAST_MS. role="status": экранный диктор прочитает текст сам */
@Component({
    selector: 'app-toast',
    template: `
        <div
            class="toast"
            role="status"
            aria-live="polite"
        >
            @if (notice(); as current) {
                <p>{{ current.text }}</p>
            }
        </div>
    `,
    styleUrl: './toast.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
    protected readonly notice = signal<Notice | null>(null);

    constructor() {
        // Было: подписка внутри подписки и ручная отмена таймера.
        // Стало: каждое уведомление превращается во внутренний поток «показать → через 3 с скрыть»,
        // а switchMap сам отписывается от предыдущего внутреннего потока при новом уведомлении
        inject(NotifierService)
            .notices$.pipe(
                switchMap((notice) => concat(of(notice), timer(TOAST_MS).pipe(map(() => null)))),
                // Последним в pipe: завершает и внешний поток, и текущий внутренний
                takeUntilDestroyed(),
            )
            .subscribe((notice) => this.notice.set(notice));
    }
}
