import { inject } from '@angular/core';
import { type CanActivateFn, type CanMatchFn, Router } from '@angular/router';

import { SessionStore, type UserRole } from '@entities/session/model/session.store';

/**
 * canActivate: пустить на маршрут или нет. Функция, а не класс — внутри работает inject().
 * true — пускаем; UrlTree — отменяем переход и ведём на другой адрес
 */
export const authGuard: CanActivateFn = (_route, state) => {
    const session = inject(SessionStore);
    const router = inject(Router);

    // returnUrl — чтобы после входа вернуть пользователя туда, куда он шёл
    return session.isSignedIn()
        ? true
        : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

/**
 * canMatch: подходит ли маршрут вообще. Срабатывает до загрузки ленивого кода —
 * чужая роль не скачает чанк кабинета владельца
 */
export function roleGuard(role: UserRole): CanMatchFn {
    return (_route, segments) => {
        const session = inject(SessionStore);
        const router = inject(Router);

        if (session.role() === role) {
            return true;
        }
        if (!session.isSignedIn()) {
            const returnUrl = `/${segments.map((segment) => segment.path).join('/')}`;
            return router.createUrlTree(['/login'], { queryParams: { returnUrl } });
        }
        // Вошёл, но роль другая — на главную
        return router.createUrlTree(['/']);
    };
}
