import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { SessionStore } from '@entities/session/model/session.store';

/** Лэйаут кабинета владельца — по образцу кабинета клиента из урока 48 */
@Component({
    selector: 'app-owner-layout',
    imports: [RouterLink, RouterLinkActive, RouterOutlet],
    template: `
        <p class="title">Кабинет владельца · {{ session.user()?.name }}</p>
        <div class="layout">
            <nav
                class="menu"
                aria-label="Разделы кабинета владельца"
            >
                <!-- exact: иначе «Мои студии» (адрес раздела) активна на любой его странице -->
                <a
                    routerLink="."
                    routerLinkActive="active"
                    ariaCurrentWhenActive="page"
                    [routerLinkActiveOptions]="{ exact: true }"
                >
                    Мои студии
                </a>
            </nav>
            <section class="page">
                <router-outlet />
            </section>
        </div>
    `,
    styleUrl: './owner-layout.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerLayoutComponent {
    protected readonly session = inject(SessionStore);
}
