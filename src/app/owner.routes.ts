import type { Routes } from '@angular/router';

import { OwnerLayoutComponent } from '@pages/owner/ui/owner-layout.component';

/** Кабинет владельца: /owner/… Подключается через loadChildren под roleGuard('owner') */
export const OWNER_ROUTES: Routes = [
    {
        path: '',
        component: OwnerLayoutComponent,
        children: [
            {
                path: '',
                title: 'Кабинет владельца',
                loadComponent: () =>
                    import('@pages/owner/ui/owner-studios-page.component').then(
                        (m) => m.OwnerStudiosPageComponent,
                    ),
            },
            // Задание модуля 04: страница своей студии — studios/:slug
        ],
    },
];
