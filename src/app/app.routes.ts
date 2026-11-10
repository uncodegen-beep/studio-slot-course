import type { Routes } from '@angular/router';

// Маршруты подробно — модуль 04; здесь минимум, чтобы у страниц были адреса
export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'studios' },
    {
        path: 'studios',
        title: 'Студии — StudioSlot',
        // Ленивая загрузка: код страницы скачивается при первом переходе на неё
        loadComponent: () =>
            import('@pages/catalog/ui/catalog-page.component').then((m) => m.CatalogPageComponent),
    },
    {
        path: 'bookings',
        title: 'Мои бронирования — StudioSlot',
        loadComponent: () =>
            import('@pages/bookings/ui/bookings-page.component').then(
                (m) => m.BookingsPageComponent,
            ),
    },
    { path: '**', redirectTo: 'studios' },
];
