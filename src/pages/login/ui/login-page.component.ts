import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { AuthApi } from '@entities/session/api/auth.api';
import { SessionStore, type UserRole } from '@entities/session/model/session.store';

/** Вход: /login?returnUrl=/account. Демо-кнопки ролей — проверка роли в мок-API */
@Component({
    selector: 'app-login-page',
    template: `
        <h1>Вход</h1>
        <p>Пока без пароля: выберите роль, чтобы посмотреть кабинеты.</p>
        <div class="roles">
            <button
                type="button"
                (click)="signIn('client')"
            >
                Войти как клиент
            </button>
            <button
                type="button"
                (click)="signIn('owner')"
            >
                Войти как владелец
            </button>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
    private readonly auth = inject(AuthApi);
    private readonly session = inject(SessionStore);
    private readonly router = inject(Router);

    /** ?returnUrl= из адреса — вход страницы (withComponentInputBinding) */
    readonly returnUrl = input<string>();

    /** Только адреса своего приложения: «//evil.example» или «https://…» не принимаем */
    private readonly target = computed(() => {
        const url = this.returnUrl();
        return url?.startsWith('/') && !url.startsWith('//') ? url : null;
    });

    protected signIn(role: UserRole): void {
        this.auth.login(role).subscribe((session) => {
            this.session.establish(session);
            void this.router.navigateByUrl(
                this.target() ?? (role === 'owner' ? '/owner' : '/account'),
            );
        });
    }
}
