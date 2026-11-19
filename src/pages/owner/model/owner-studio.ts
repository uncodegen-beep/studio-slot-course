import { inject } from '@angular/core';
import { type CanActivateFn, RedirectCommand, type ResolveFn, Router } from '@angular/router';

import { catchError, of } from 'rxjs';

import { SessionStore, type SessionUser } from '@entities/session/model/session.store';
import { StudiosApi } from '@entities/studio/api/studios.api';

import type { Studio } from '@shared/model';

/** Владелец и студия в его списке. Одна проверка для списка студий и для guard страницы студии */
export function ownsStudio(user: SessionUser | null, studioId: string): boolean {
    return user?.role === 'owner' && user.studioIds.includes(studioId);
}

/**
 * canActivate, а не canMatch: роль уже проверил roleGuard на /owner,
 * а здесь нужен :slug — параметры есть у снимка маршрута
 */
export const ownsStudioGuard: CanActivateFn = (route) => {
    const session = inject(SessionStore);
    const router = inject(Router);

    return ownsStudio(session.user(), route.paramMap.get('slug') ?? '')
        ? true
        : router.createUrlTree(['/owner']);
};

/** Guard уже пропустил — значит, студия своя. Грузим её; ошибка — обратно к списку */
export const ownerStudioResolver: ResolveFn<Studio> = (route) => {
    const router = inject(Router);

    return inject(StudiosApi)
        .getById(route.paramMap.get('slug') ?? '')
        .pipe(catchError(() => of(new RedirectCommand(router.parseUrl('/owner')))));
};
