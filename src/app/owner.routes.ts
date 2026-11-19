import type { Routes } from '@angular/router';

import { ownerStudioResolver, ownsStudioGuard } from '@pages/owner/model/owner-studio';
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
                    import('@pages/owner/ui/owner-studio-page.component').then(
                        (m) => m.OwnerStudioPageComponent,
                    ),
            },
            {
                // Сначала guard (своя ли студия), потом resolver (загрузка): чужую даже не запрашиваем
                path: 'studios/:slug',
                title: 'Студия',
                canActivate: [ownsStudioGuard],
                resolve: { studio: ownerStudioResolver },
                loadComponent: () =>
                    import('@pages/owner/ui/owner-studio-page.component').then(
                        (m) => m.OwnerStudioPageComponent,
                    ),
            },
        ],
    },
];
