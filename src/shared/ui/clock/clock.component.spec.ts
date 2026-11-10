import { TestBed } from '@angular/core/testing';

import { ClockComponent } from './clock.component';

describe('ClockComponent', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2026, 10, 14, 18, 0, 0));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('показывает время и обновляет его каждую секунду', () => {
        const fixture = TestBed.createComponent(ClockComponent);
        fixture.detectChanges();
        const time = (): string | null | undefined =>
            (fixture.nativeElement as HTMLElement).querySelector('time')?.textContent;

        expect(time()).toBe('18:00:00');

        vi.advanceTimersByTime(2000);
        // сигнал изменился — компонент помечен к обновлению
        fixture.detectChanges();

        expect(time()).toBe('18:00:02');
    });
});
