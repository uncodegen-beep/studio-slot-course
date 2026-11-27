import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { StudioSearchComponent } from '@features/search-studios/ui/studio-search.component';
import { FavoritesStore } from '@features/toggle-favorite/model/favorites.store';

import { AuthApi } from '@entities/session/api/auth.api';
import { SessionStore } from '@entities/session/model/session.store';

import { ClockComponent } from '@shared/ui/clock/clock.component';

@Component({
    selector: 'app-header',
    imports: [ClockComponent, RouterLink, RouterLinkActive, StudioSearchComponent],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
    protected readonly appName = 'StudioSlot';
    protected readonly favoritesStore = inject(FavoritesStore);
    protected readonly session = inject(SessionStore);
    private readonly auth = inject(AuthApi);
    private readonly router = inject(Router);

    protected signOut(): void {
        this.auth.logout().subscribe(() => {
            this.session.signOut();
            // Со страницы под guard уходим сами: guard проверяет только при переходе
            void this.router.navigateByUrl('/');
        });
    }
}
