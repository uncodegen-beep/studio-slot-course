import { inject } from '@angular/core';
import { Router, type Routes } from '@angular/router';

import { AccountLayoutComponent } from '@pages/account/ui/account-layout.component';

import { SessionStore } from '@entities/session/model/session.store';

/**
 * Раздел «Личный кабинет»: /account/…
 * Файл подключается через loadChildren — и он сам, и страницы раздела попадают в отдельные чанки
 */
export const ACCOUNT_ROUTES: Routes = [
    {
        // Родитель без своего сегмента: лэйаут кабинета, дети рисуются в его router-outlet
        path: '',
        component: AccountLayoutComponent,
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'bookings' },
            {
                path: 'bookings',
                canActivate: [
                    () =>
                        inject(SessionStore).role() === 'client' ||
                        inject(Router).parseUrl('/account/favorites'),
                ],
                title: 'Мои бронирования',
                loadComponent: () =>
                    import('@pages/bookings/ui/bookings-page.component').then(
                        (m) => m.BookingsPageComponent,
                    ),
            },
            {
                path: 'favorites',
                title: 'Избранное',
                loadComponent: () =>
                    import('@pages/favorites/ui/favorites-page.component').then(
                        (m) => m.FavoritesPageComponent,
                    ),
            },
        ],
    },
];
