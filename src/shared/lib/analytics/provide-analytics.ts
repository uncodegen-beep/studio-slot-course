import {
    type EnvironmentProviders,
    type Provider,
    inject,
    makeEnvironmentProviders,
    provideAppInitializer,
} from '@angular/core';

import { ANALYTICS_SINKS } from './analytics-sink';
import { AnalyticsService } from './analytics.service';
import { ConsoleAnalyticsSink } from './console-analytics.sink';

/** Опция фичи — как withFetch() у provideHttpClient: имя и свои провайдеры */
export interface AnalyticsFeature {
    readonly kind: 'console-sink';
    readonly providers: readonly Provider[];
}

/** Получатель для разработки: события в консоли браузера */
export function withConsoleSink(): AnalyticsFeature {
    return {
        kind: 'console-sink',
        providers: [{ provide: ANALYTICS_SINKS, useClass: ConsoleAnalyticsSink, multi: true }],
    };
}

/**
 * Вся настройка аналитики — одной функцией: provideAnalytics(withConsoleSink()).
 * EnvironmentProviders можно передать только приложению или маршруту, не компоненту
 */
export function provideAnalytics(...features: readonly AnalyticsFeature[]): EnvironmentProviders {
    return makeEnvironmentProviders([
        ...features.flatMap((feature) => feature.providers),
        // Выполняется до первого экрана; внутри работает inject()
        provideAppInitializer(() => {
            inject(AnalyticsService).track('app_start', {
                features: features.map((feature) => feature.kind),
            });
        }),
    ]);
}
