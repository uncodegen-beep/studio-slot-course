import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

/**
 * Лэйаут кабинета: заголовок и меню раздела общие, страница — во вложенном router-outlet.
 * При переходе между /account/bookings и /account/favorites лэйаут не пересоздаётся
 */
@Component({
    selector: 'app-account-layout',
    imports: [RouterLink, RouterLinkActive, RouterOutlet],
    template: `
        <p class="title">Личный кабинет</p>
        <div class="layout">
            <nav
                class="menu"
                aria-label="Разделы кабинета"
            >
                <!-- Относительные ссылки: от адреса этого лэйаута, то есть /account/… -->
                <a
                    routerLink="bookings"
                    routerLinkActive="active"
                    ariaCurrentWhenActive="page"
                >
                    Бронирования
                </a>
                <a
                    routerLink="favorites"
                    routerLinkActive="active"
                    ariaCurrentWhenActive="page"
                >
                    Избранное
                </a>
            </nav>
            <section class="page">
                <router-outlet />
            </section>
        </div>
    `,
    styleUrl: './account-layout.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountLayoutComponent {}
