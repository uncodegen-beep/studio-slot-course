import { DOCUMENT } from '@angular/common';
import { HttpContextToken, HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, throwError } from 'rxjs';

import { SessionStore } from '@entities/session/model/session.store';

import { APP_CONFIG } from '@shared/config/app-config';

export const SKIP_AUTH = new HttpContextToken(() => false);
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const base = inject(DOCUMENT).baseURI;
    const api = new URL(inject(APP_CONFIG).apiBaseUrl, base);
    const target = new URL(req.url, base);
    if (
        req.context.get(SKIP_AUTH) ||
        target.origin !== api.origin ||
        !target.pathname.startsWith(api.pathname.replace(/\/$/, '') + '/')
    )
        return next(req);
    const session = inject(SessionStore);
    const router = inject(Router);
    const token = session.accessToken();
    return next(token ? req.clone({ setHeaders: { Authorization: 'Bearer ' + token } }) : req).pipe(
        catchError((error: unknown) => {
            if (
                error instanceof HttpErrorResponse &&
                error.status === 401 &&
                token === session.accessToken()
            ) {
                session.signOut();
                void router.navigate(['/login']);
            }
            return throwError(() => error);
        }),
    );
};
