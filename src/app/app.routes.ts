import type { Routes } from '@angular/router';

import { HomePageComponent } from '@pages/home/ui/home-page.component';

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
        loadChildren: () => import('./account.routes').then((m) => m.ACCOUNT_ROUTES),
    },
    // Старый адрес из закладок и писем продолжает работать
    { path: 'bookings', redirectTo: 'account/bookings' },
    // Неизвестный адрес — на главную. Страница 404 — урок 51
    { path: '**', redirectTo: '' },
];
