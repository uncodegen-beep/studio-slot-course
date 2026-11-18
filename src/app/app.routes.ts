import type { Routes } from '@angular/router';

import { HomePageComponent } from '@pages/home/ui/home-page.component';

import { authGuard, roleGuard } from '@features/auth/model/auth.guards';

/**
 * Таблица маршрутов. Роутер проверяет её сверху вниз — побеждает первый подходящий.
 * Конкретные пути выше, '**' — всегда последним
 */
export const routes: Routes = [
    // component — страница в основном бандле: главную видят первой, грузить её отдельно незачем
    { path: '', title: 'StudioSlot — студии по часам', component: HomePageComponent },
    {
        path: 'studios',
        title: 'Студии — StudioSlot',
        // loadComponent — код страницы скачивается при первом переходе на неё
        loadComponent: () =>
            import('@pages/catalog/ui/catalog-page.component').then((m) => m.CatalogPageComponent),
    },
    {
        // :id — любой один сегмент: /studios/nevsky-beat. '/studios' сюда не попадёт — сегментов меньше
        path: 'studios/:id',
        title: 'Студия — StudioSlot',
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
        title: 'Кабинет владельца — StudioSlot',
        // canMatch проверяется до загрузки чанка: клиент и гость его не скачают
        canMatch: [roleGuard('owner')],
        loadComponent: () =>
            import('@pages/owner/ui/owner-page.component').then((m) => m.OwnerPageComponent),
    },
    {
        path: 'login',
        title: 'Вход — StudioSlot',
        loadComponent: () =>
            import('@pages/login/ui/login-page.component').then((m) => m.LoginPageComponent),
    },
    // Старый адрес из закладок и писем продолжает работать
    { path: 'bookings', redirectTo: 'account/bookings' },
    // Неизвестный адрес — на главную. Страница 404 — урок 51
    { path: '**', redirectTo: '' },
];
