import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

import { type Subscription, timer } from 'rxjs';

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
        let hide: Subscription | undefined;
        const notices = inject(NotifierService).notices$.subscribe((notice) => {
            this.notice.set(notice);
            // Новое уведомление — старый таймер скрытия отменяем.
            // Подписка внутри подписки и ручная отмена — в уроке 60 заменим одним оператором
            hide?.unsubscribe();
            hide = timer(TOAST_MS).subscribe(() => this.notice.set(null));
        });
        inject(DestroyRef).onDestroy(() => {
            notices.unsubscribe();
            hide?.unsubscribe();
        });
    }
}
