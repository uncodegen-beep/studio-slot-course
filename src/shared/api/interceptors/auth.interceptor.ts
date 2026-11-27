import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, of, switchMap, throwError } from 'rxjs';

import { TokenRefresher } from '@entities/session/api/token-refresher';
import { SessionStore } from '@entities/session/model/session.store';

import { APP_CONFIG } from '@shared/config/app-config';

import { SKIP_AUTH } from './skip-auth';

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
    const refresher = inject(TokenRefresher);
    const version = session.sessionVersion;
    const token = session.accessToken();
    return next(token ? req.clone({ setHeaders: { Authorization: 'Bearer ' + token } }) : req).pipe(
        catchError((error: unknown) => {
            if (!(error instanceof HttpErrorResponse) || error.status !== 401)
                return throwError(() => error);
            const current = session.accessToken();
            if (!token || !current || version !== session.sessionVersion)
                return throwError(() => error);
            const renewed = current && current !== token ? of(current) : refresher.refresh();
            return renewed.pipe(
                catchError((failure: unknown) => {
                    if (session.accessToken() === token) {
                        session.signOut();
                        void router.navigate(['/login']);
                    }
                    return throwError(() => failure);
                }),
                switchMap((accessToken) =>
                    next(req.clone({ setHeaders: { Authorization: 'Bearer ' + accessToken } })),
                ),
            );
        }),
    );
};
