import { HttpContextToken, HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';

import { finalize, retry, throwError, timer } from 'rxjs';

import { APP_CONFIG } from '@shared/config/app-config';

export const SILENT = new HttpContextToken(() => false);
export const LOCAL_RETRY = new HttpContextToken(() => false);

@Injectable({ providedIn: 'root' })
export class GlobalLoading {
    private readonly count = signal(0);
    readonly active = this.count.asReadonly();
    start(): void {
        this.count.update((n) => n + 1);
    }
    stop(): void {
        this.count.update((n) => n - 1);
    }
}
export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
    if (!req.url.startsWith('api/')) return next(req);
    return next(
        req.clone({ url: inject(APP_CONFIG).apiBaseUrl.replace(/\/$/, '') + req.url.slice(3) }),
    );
};
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.context.get(SILENT)) return next(req);
    const loading = inject(GlobalLoading);
    loading.start();
    return next(req).pipe(finalize(() => loading.stop()));
};
export const retryInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.method !== 'GET' || req.context.get(LOCAL_RETRY)) return next(req);
    return next(req).pipe(
        retry({
            count: 2,
            delay: (error: unknown, attempt) =>
                error instanceof HttpErrorResponse && (error.status === 0 || error.status >= 500)
                    ? timer(400 * 2 ** (attempt - 1))
                    : throwError(() => error),
        }),
    );
};
