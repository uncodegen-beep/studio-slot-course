import { TestBed } from '@angular/core/testing';

import { ANALYTICS_SINKS } from './analytics-sink';
import { AnalyticsService } from './analytics.service';
import { ConsoleAnalyticsSink } from './console-analytics.sink';
import { provideAnalytics, withConsoleSink } from './provide-analytics';

describe('provideAnalytics', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('без опций: получателей нет, app_start всё равно записан', () => {
        TestBed.configureTestingModule({ providers: [provideAnalytics()] });

        expect(TestBed.inject(ANALYTICS_SINKS, null)).toBeNull();
        expect(TestBed.inject(AnalyticsService).events()).toEqual([
            { name: 'app_start', params: { features: [] } },
        ]);
    });

    it('withConsoleSink: получатель в консоль и app_start до первого экрана', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        TestBed.configureTestingModule({ providers: [provideAnalytics(withConsoleSink())] });

        const sinks = TestBed.inject(ANALYTICS_SINKS);

        expect(sinks).toHaveLength(1);
        expect(sinks[0]).toBeInstanceOf(ConsoleAnalyticsSink);
        expect(warn).toHaveBeenCalledWith('[analytics]', 'app_start', {
            features: ['console-sink'],
        });
    });
});
