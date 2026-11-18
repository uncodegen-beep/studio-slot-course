import type { Routes } from '@angular/router';

/**
 * Раздел «Личный кабинет»: /account/…
 * Файл подключается через loadChildren — и он сам, и страницы раздела попадают в отдельные чанки
 */
export const ACCOUNT_ROUTES: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'bookings' },
    {
        path: 'bookings',
        title: 'Мои бронирования — StudioSlot',
        loadComponent: () =>
            import('@pages/bookings/ui/bookings-page.component').then(
                (m) => m.BookingsPageComponent,
            ),
    },
    {
        path: 'favorites',
        title: 'Избранное — StudioSlot',
        loadComponent: () =>
            import('@pages/favorites/ui/favorites-page.component').then(
                (m) => m.FavoritesPageComponent,
            ),
    },
];
