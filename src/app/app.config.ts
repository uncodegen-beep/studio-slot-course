import { DOCUMENT } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { type ApplicationConfig, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { PricingService } from '@features/book-slot/model/pricing.service';
import { PromoPricingService } from '@features/book-slot/model/promo-pricing.service';

import { ANALYTICS_SINKS } from '@shared/lib/analytics/analytics-sink';
import { ConsoleAnalyticsSink } from '@shared/lib/analytics/console-analytics.sink';
import { provideRuLocale } from '@shared/lib/locale/provide-ru-locale';

import { environment } from '../environments/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        // withComponentInputBinding: параметр :id маршрута приходит во вход id() страницы
        provideRouter(routes, withComponentInputBinding()),
        // HttpClient на fetch — нужен httpResource
        provideHttpClient(withFetch()),
        provideRuLocale(),
        // useFactory: реализация выбирается при создании — ?promo в адресе включает промо-тариф
        {
            provide: PricingService,
            useFactory: () =>
                inject(DOCUMENT).location.search.includes('promo')
                    ? new PromoPricingService()
                    : new PricingService(),
        },
        // multi: получатели аналитики собираются в массив. В консоль — только в разработке
        ...(environment.analyticsToConsole
            ? [{ provide: ANALYTICS_SINKS, useClass: ConsoleAnalyticsSink, multi: true }]
            : []),
    ],
};
