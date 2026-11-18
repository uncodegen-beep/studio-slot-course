import type { Routes } from '@angular/router';

import { HomePageComponent } from '@pages/home/ui/home-page.component';
import { NotFoundPageComponent } from '@pages/not-found/ui/not-found-page.component';
import { studioResolver } from '@pages/studio/model/studio.resolver';

import { authGuard, roleGuard } from '@features/auth/model/auth.guards';

/**
 * Таблица маршрутов. Роутер проверяет её сверху вниз — побеждает первый подходящий.
 * Конкретные пути выше, '**' — всегда последним
 */
export const routes: Routes = [
    // component — страница в основном бандле: главную видят первой, грузить её отдельно незачем
    // Без title — заголовок по умолчанию из AppTitleStrategy
    { path: '', component: HomePageComponent },
    {
        path: 'studios',
        title: 'Студии',
        // loadComponent — код страницы скачивается при первом переходе на неё
        loadComponent: () =>
            import('@pages/catalog/ui/catalog-page.component').then((m) => m.CatalogPageComponent),
    },
    {
        // :id — любой один сегмент: /studios/nevsky-beat. '/studios' сюда не попадёт — сегментов меньше
        path: 'studios/:id',
        title: 'Студия',
        // Страница откроется, когда студия загружена; ошибка — редирект в каталог
        resolve: { studio: studioResolver },
        loadComponent: () =>
            import('@pages/studio/ui/studio-page.component').then((m) => m.StudioPageComponent),
    },
    {
        // loadChildren — целый раздел маршрутов в отдельном чанке: грузится при первом входе в /account
        path: 'account',
        // Гость уходит на /login?returnUrl=/account/…
        canActivate: [authGuard],
        loadChildren: () => import('./account.routes').then((m) => m.ACCOUNT_ROUTES),
    },
    {
        path: 'owner',
        title: 'Кабинет владельца',
        // canMatch проверяется до загрузки чанка: клиент и гость его не скачают
        canMatch: [roleGuard('owner')],
        loadComponent: () =>
            import('@pages/owner/ui/owner-page.component').then((m) => m.OwnerPageComponent),
    },
    {
        path: 'login',
        title: 'Вход',
        loadComponent: () =>
            import('@pages/login/ui/login-page.component').then((m) => m.LoginPageComponent),
    },
    // Старый адрес из закладок и писем продолжает работать
    { path: 'bookings', redirectTo: 'account/bookings' },
    // Функция вместо строки: старые ссылки /studio/:id → /studios/:id
    { path: 'studio/:id', redirectTo: ({ params }) => `/studios/${params['id']}` },
    // Сюда ведёт resolver, если студии нет
    { path: 'not-found', title: 'Страница не найдена', component: NotFoundPageComponent },
    // Неизвестный адрес — 404 без редиректа: в строке браузера остаётся адрес с ошибкой
    { path: '**', title: 'Страница не найдена', component: NotFoundPageComponent },
];
