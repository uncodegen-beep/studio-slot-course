import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ANALYTICS_SINKS, type AnalyticsSink } from './analytics-sink';
import { type AnalyticsEvent, AnalyticsService } from './analytics.service';

@Injectable({ providedIn: 'root' })
class MemorySink implements AnalyticsSink {
    readonly received: AnalyticsEvent[] = [];

    send(event: AnalyticsEvent): void {
        this.received.push(event);
    }
}

describe('AnalyticsService', () => {
    it('без получателей просто копит события', () => {
        const analytics = TestBed.inject(AnalyticsService);

        analytics.track('catalog_search', { query: 'volga' });

        expect(analytics.events()).toEqual([
            { name: 'catalog_search', params: { query: 'volga' } },
        ]);
    });

    it('multi: событие уходит каждому получателю', () => {
        const sent: string[] = [];
        TestBed.configureTestingModule({
            providers: [
                // useExisting — тот же экземпляр MemorySink, что вернёт inject(MemorySink)
                { provide: ANALYTICS_SINKS, useExisting: MemorySink, multi: true },
                // useValue — готовый объект
                {
                    provide: ANALYTICS_SINKS,
                    useValue: { send: (event: AnalyticsEvent) => sent.push(event.name) },
                    multi: true,
                },
            ],
        });

        TestBed.inject(AnalyticsService).track('booking_submit');

        expect(TestBed.inject(MemorySink).received.map((event) => event.name)).toEqual([
            'booking_submit',
        ]);
        expect(sent).toEqual(['booking_submit']);
    });
});
