import { ApplicationRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { SessionStore } from '@entities/session/model/session.store';

import { authGuard, roleGuard } from './auth.guards';

@Component({ template: '', changeDetection: ChangeDetectionStrategy.OnPush })
class StubPageComponent {}

/** Переход и итоговый адрес: guard мог отменить переход и отправить на другой */
async function open(url: string): Promise<string> {
    const router = TestBed.inject(Router);
    await router.navigateByUrl(url);
    await TestBed.inject(ApplicationRef).whenStable();
    return decodeURIComponent(router.url);
}

describe('guards', () => {
    beforeEach(() => {
        localStorage.clear();
        TestBed.configureTestingModule({
            providers: [
                provideRouter([
                    { path: '', component: StubPageComponent },
                    { path: 'login', component: StubPageComponent },
                    { path: 'account', canActivate: [authGuard], component: StubPageComponent },
                    {
                        path: 'owner',
                        canMatch: [roleGuard('owner')],
                        component: StubPageComponent,
                    },
                ]),
            ],
        });
    });

    it('authGuard: гость уходит на вход с returnUrl', async () => {
        expect(await open('/account')).toBe('/login?returnUrl=/account');
    });

    it('authGuard: вошедший проходит', async () => {
        TestBed.inject(SessionStore).signIn('client');

        expect(await open('/account')).toBe('/account');
    });

    it('roleGuard: владелец проходит', async () => {
        TestBed.inject(SessionStore).signIn('owner');

        expect(await open('/owner')).toBe('/owner');
    });

    it('roleGuard: клиент — на главную', async () => {
        TestBed.inject(SessionStore).signIn('client');

        expect(await open('/owner')).toBe('/');
    });

    it('roleGuard: гость — на вход с returnUrl', async () => {
        expect(await open('/owner')).toBe('/login?returnUrl=/owner');
    });
});
