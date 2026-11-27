import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { StudioSearchComponent } from '@features/search-studios/ui/studio-search.component';
import { FavoritesStore } from '@features/toggle-favorite/model/favorites.store';

import { AuthApi } from '@entities/session/api/auth.api';
import { SessionStore } from '@entities/session/model/session.store';

import { NotifierService } from '@shared/lib/notify/notifier.service';
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
    private readonly notifier = inject(NotifierService);
    private readonly auth = inject(AuthApi);
    private readonly router = inject(Router);

    protected signOut(): void {
        // Запускаем запрос, пока interceptor ещё может прочитать токен.
        this.auth.logout().subscribe({
            error: () =>
                this.notifier.notify('Вы вышли на этом устройстве. Сервер не подтвердил выход.'),
        });
        this.session.signOut();
        void this.router.navigateByUrl('/');
    }
}
