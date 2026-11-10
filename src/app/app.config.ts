import { provideHttpClient, withFetch } from '@angular/common/http';
import { type ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { provideRuLocale } from '@shared/lib/locale/provide-ru-locale';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        // withComponentInputBinding: параметр :id маршрута приходит во вход id() страницы
        provideRouter(routes, withComponentInputBinding()),
        // HttpClient на fetch — нужен httpResource
        provideHttpClient(withFetch()),
        provideRuLocale(),
    ],
};
