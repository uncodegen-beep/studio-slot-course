import { TestBed } from '@angular/core/testing';

import { NotifierService } from '@shared/lib/notify/notifier.service';

import { TOAST_MS, ToastComponent } from './toast.component';

describe('ToastComponent', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    function setup(): { root: HTMLElement; notify: (text: string) => void; render: () => void } {
        const fixture = TestBed.createComponent(ToastComponent);
        fixture.detectChanges();
        const notifier = TestBed.inject(NotifierService);
        return {
            root: fixture.nativeElement as HTMLElement,
            notify: (text) => notifier.notify(text),
            render: () => fixture.detectChanges(),
        };
    }

    it('показывает уведомление и скрывает через TOAST_MS', () => {
        const { root, notify, render } = setup();

        notify('Добавлено в избранное');
        render();
        expect(root.querySelector('[role="status"] p')?.textContent).toBe('Добавлено в избранное');

        vi.advanceTimersByTime(TOAST_MS);
        render();
        expect(root.querySelector('[role="status"] p')).toBeNull();
    });

    it('новое уведомление сбрасывает таймер скрытия', () => {
        const { root, notify, render } = setup();

        notify('Первое');
        vi.advanceTimersByTime(TOAST_MS - 500);
        notify('Второе');
        vi.advanceTimersByTime(1000);
        render();

        expect(root.querySelector('[role="status"] p')?.textContent).toBe('Второе');
    });
});
