import { provideHttpClient, withFetch } from '@angular/common/http';
import { type ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { providePricing, withPromoFromQuery } from '@features/book-slot/model/provide-pricing';

import { provideAnalytics, withConsoleSink } from '@shared/lib/analytics/provide-analytics';
import { provideRuLocale } from '@shared/lib/locale/provide-ru-locale';

import { environment } from '../environments/environment';
import { routes } from './app.routes';

/** Каждая фича настраивается одной provide-функцией — как provideRouter и provideHttpClient */
export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        // withComponentInputBinding: параметр :id маршрута приходит во вход id() страницы
        provideRouter(routes, withComponentInputBinding()),
        // HttpClient на fetch — нужен httpResource
        provideHttpClient(withFetch()),
        provideRuLocale(),
        // ?promo в адресе включает промо-тариф
        providePricing(withPromoFromQuery()),
        // События в консоль — только в разработке
        provideAnalytics(...(environment.analyticsToConsole ? [withConsoleSink()] : [])),
    ],
};
