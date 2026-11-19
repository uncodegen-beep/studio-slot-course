import { ticks } from './ticks';

describe('ticks', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2026, 10, 14, 18, 0, 0));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('ленивый: без подписки таймер не запускается', () => {
        ticks(1000);

        expect(vi.getTimerCount()).toBe(0);
    });

    it('next — раз в интервал, unsubscribe останавливает таймер', () => {
        const seconds: number[] = [];
        const subscription = ticks(1000).subscribe((now) => seconds.push(now.getSeconds()));

        vi.advanceTimersByTime(3000);
        subscription.unsubscribe();
        vi.advanceTimersByTime(3000);

        expect(seconds).toEqual([1, 2, 3]);
        expect(vi.getTimerCount()).toBe(0);
    });

    it('холодный: у каждой подписки свой таймер', () => {
        const first = ticks(1000).subscribe();
        const second = ticks(1000).subscribe();

        expect(vi.getTimerCount()).toBe(2);

        first.unsubscribe();
        second.unsubscribe();
    });
});
