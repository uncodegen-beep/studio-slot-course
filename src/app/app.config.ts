import { provideHttpClient, withFetch } from '@angular/common/http';
import { type ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
    PreloadAllModules,
    provideRouter,
    withComponentInputBinding,
    withPreloading,
} from '@angular/router';

import { provideBookingConfig } from '@features/book-slot/model/booking-config';
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
        // withPreloading: после загрузки приложения ленивые чанки докачиваются в фоне
        provideRouter(routes, withComponentInputBinding(), withPreloading(PreloadAllModules)),
        // HttpClient на fetch — нужен httpResource
        provideHttpClient(withFetch()),
        provideRuLocale(),
        // ?promo в адресе включает промо-тариф
        providePricing(withPromoFromQuery()),
        // Часы работы площадки: слоты с 10:00, последний начинается в 20:00
        provideBookingConfig({ openHour: 10, closeHour: 22 }),
        // События в консоль — только в разработке
        provideAnalytics(...(environment.analyticsToConsole ? [withConsoleSink()] : [])),
    ],
};
