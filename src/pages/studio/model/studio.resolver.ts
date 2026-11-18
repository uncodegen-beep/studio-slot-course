import { inject } from '@angular/core';
import { RedirectCommand, type ResolveFn, Router } from '@angular/router';

import { catchError, of } from 'rxjs';

import { StudiosApi } from '@entities/studio/api/studios.api';

import type { Studio } from '@shared/model';

/**
 * Данные до показа страницы: роутер ждёт ответ и только потом рисует компонент.
 * Результат приходит во вход studio страницы (withComponentInputBinding), ключ resolve = имя входа
 */
export const studioResolver: ResolveFn<Studio> = (route) => {
    const router = inject(Router);
    const id = route.paramMap.get('id') ?? '';

    return inject(StudiosApi)
        .getById(id)
        .pipe(
            // Студии нет — показываем 404. skipLocationChange: адрес в браузере не меняется на /not-found
            catchError(() =>
                of(
                    new RedirectCommand(router.parseUrl('/not-found'), {
                        skipLocationChange: true,
                    }),
                ),
            ),
        );
};
