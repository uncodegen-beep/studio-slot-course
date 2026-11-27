import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { SessionStore } from '@entities/session/model/session.store';

import { LoginPageComponent } from './login-page.component';

@Component({ template: '', changeDetection: ChangeDetectionStrategy.OnPush })
class StubPageComponent {}

async function signInAs(label: string, returnUrl?: string): Promise<string> {
    const fixture = TestBed.createComponent(LoginPageComponent);
    if (returnUrl !== undefined) {
        fixture.componentRef.setInput('returnUrl', returnUrl);
    }
    fixture.detectChanges();
    const button = [...(fixture.nativeElement as HTMLElement).querySelectorAll('button')].find(
        (b) => b.textContent?.trim() === label,
    );
    button?.click();
    const req = TestBed.inject(HttpTestingController).expectOne('api/auth/demo');
    req.flush({
        user: { name: 'Демо', role: req.request.body.role, studioIds: [] },
        accessToken: 'demo',
    });
    await TestBed.inject(ApplicationRef).whenStable();
    return TestBed.inject(Router).url;
}

describe('LoginPageComponent', () => {
    beforeEach(() => {
        localStorage.clear();
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([
                    { path: 'account', component: StubPageComponent },
                    { path: 'owner', component: StubPageComponent },
                ]),
            ],
        });
    });

    it('после входа — обратно на returnUrl', async () => {
        expect(await signInAs('Войти как владелец', '/owner')).toBe('/owner');
        expect(TestBed.inject(SessionStore).role()).toBe('owner');
    });

    it('без returnUrl — в кабинет', async () => {
        expect(await signInAs('Войти как клиент')).toBe('/account');
    });

    it('чужой адрес в returnUrl не принимается', async () => {
        expect(await signInAs('Войти как клиент', '//evil.example')).toBe('/account');
    });
});
