import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import type { Observable } from 'rxjs';

import { SKIP_AUTH } from '@shared/api/interceptors/auth.interceptor';

import type { Session, UserRole } from '../model/session.store';

@Injectable({ providedIn: 'root' })
export class AuthApi {
    private readonly http = inject(HttpClient);
    login(role: UserRole): Observable<Session> {
        return this.http.post<Session>(
            'api/auth/demo',
            { role },
            { context: new HttpContext().set(SKIP_AUTH, true) },
        );
    }
    logout(): Observable<void> {
        return this.http.post<void>('api/auth/logout', {});
    }
}
