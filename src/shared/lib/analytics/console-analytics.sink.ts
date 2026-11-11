import { Injectable } from '@angular/core';

import type { AnalyticsSink } from './analytics-sink';
import type { AnalyticsEvent } from './analytics.service';

/** Получатель для разработки: события видно в консоли браузера */
@Injectable()
export class ConsoleAnalyticsSink implements AnalyticsSink {
    send(event: AnalyticsEvent): void {
        console.warn('[analytics]', event.name, event.params);
    }
}
