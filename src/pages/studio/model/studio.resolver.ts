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
            // Студии нет или сервер не ответил — переход заменяется переходом в каталог.
            // Страница 404 появится в уроке 51
            catchError(() => of(new RedirectCommand(router.parseUrl('/studios')))),
        );
};
