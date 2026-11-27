import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
    type ApplicationConfig,
    ErrorHandler,
    provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { inject, provideAppInitializer } from '@angular/core';
import {
    PreloadAllModules,
    provideRouter,
    withComponentInputBinding,
    withInMemoryScrolling,
    withPreloading,
    withViewTransitions,
} from '@angular/router';

import { catchError, firstValueFrom, of } from 'rxjs';

import { provideBookingConfig } from '@features/book-slot/model/booking-config';
import { providePricing, withPromoFromQuery } from '@features/book-slot/model/provide-pricing';

import { TokenRefresher } from '@entities/session/api/token-refresher';

import { authInterceptor } from '@shared/api/interceptors/auth.interceptor';
import {
    apiUrlInterceptor,
    loadingInterceptor,
    retryInterceptor,
} from '@shared/api/interceptors/http.interceptors';
import { AppErrorHandler } from '@shared/api/request-error';
import { provideAnalytics, withConsoleSink } from '@shared/lib/analytics/provide-analytics';
import { provideRuLocale } from '@shared/lib/locale/provide-ru-locale';
import { provideAppTitleStrategy } from '@shared/lib/title/app-title.strategy';

import { environment } from '../environments/environment';
import { routes } from './app.routes';

/** Каждая фича настраивается одной provide-функцией — как provideRouter и provideHttpClient */
export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        { provide: ErrorHandler, useClass: AppErrorHandler },
        provideAppInitializer(() =>
            firstValueFrom(
                inject(TokenRefresher)
                    .refresh()
                    .pipe(catchError(() => of(null))),
            ),
        ),
        // withComponentInputBinding: параметр :id маршрута приходит во вход id() страницы
        // withPreloading: после загрузки приложения ленивые чанки докачиваются в фоне
        provideRouter(
            routes,
            withComponentInputBinding(),
            withPreloading(PreloadAllModules),
            // Новая страница — с начала, «Назад» — на прежнюю позицию, #booking — к якорю
            withInMemoryScrolling({
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
            }),
            // Плавная смена страниц через View Transitions API браузера
            withViewTransitions(),
        ),
        // «Страница — StudioSlot» во вкладке браузера
        provideAppTitleStrategy(),
        // HttpClient на fetch — нужен httpResource
        provideHttpClient(
            withFetch(),
            withInterceptors([
                apiUrlInterceptor,
                authInterceptor,
                loadingInterceptor,
                retryInterceptor,
            ]),
        ),
        provideRuLocale(),
        // ?promo в адресе включает промо-тариф
        providePricing(withPromoFromQuery()),
        // Часы работы площадки: слоты с 10:00, последний начинается в 20:00
        provideBookingConfig({ openHour: 10, closeHour: 22 }),
        // События в консоль — только в разработке
        provideAnalytics(...(environment.analyticsToConsole ? [withConsoleSink()] : [])),
    ],
};
