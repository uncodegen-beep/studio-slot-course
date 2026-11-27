import { Injectable, inject } from '@angular/core';

import { type Observable, finalize, map, shareReplay } from 'rxjs';

import { SessionStore } from '../model/session.store';
import { AuthApi } from './auth.api';

@Injectable({ providedIn: 'root' })
export class TokenRefresher {
    private readonly api = inject(AuthApi);
    private readonly session = inject(SessionStore);
    private pending: Observable<string> | null = null;
    private pendingVersion = -1;
    refresh(): Observable<string> {
        const previous = this.session.accessToken();
        const version = this.session.sessionVersion;
        if (this.pendingVersion !== version) this.pending = null;
        this.pendingVersion = version;
        this.pending ??= this.api.refresh().pipe(
            map((result) => {
                if (
                    this.session.sessionVersion !== version ||
                    this.session.accessToken() !== previous
                )
                    throw new Error('Сессия изменилась');
                this.session.renew(result);
                return result.accessToken;
            }),
            finalize(() => {
                if (this.pendingVersion === version) this.pending = null;
            }),
            shareReplay({ bufferSize: 1, refCount: false }),
        );
        return this.pending;
    }
}
