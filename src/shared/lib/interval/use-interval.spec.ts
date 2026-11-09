import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { useInterval } from './use-interval';

let ticks = 0;

@Component({
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class TickerComponent {
    constructor() {
        useInterval(() => ticks++, 1000);
    }
}

describe('useInterval', () => {
    beforeEach(() => {
        ticks = 0;
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('вызывает колбэк с интервалом и останавливается при уничтожении', () => {
        const fixture = TestBed.createComponent(TickerComponent);

        vi.advanceTimersByTime(3000);
        expect(ticks).toBe(3);

        fixture.destroy();
        vi.advanceTimersByTime(3000);
        expect(ticks).toBe(3);
    });

    it('вне контекста внедрения бросает ошибку', () => {
        expect(() => useInterval(() => undefined, 1000)).toThrow();
    });
});
