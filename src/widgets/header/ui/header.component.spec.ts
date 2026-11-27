import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { SessionStore } from '@entities/session/model/session.store';

import { HeaderComponent } from './header.component';

@Component({ template: '', changeDetection: ChangeDetectionStrategy.OnPush })
class StubPageComponent {}

describe('HeaderComponent', () => {
    beforeEach(() => {
        localStorage.clear();
        TestBed.configureTestingModule({
            providers: [
                // В шапке поиск — ему нужен HttpClient
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([
                    { path: '', component: StubPageComponent },
                    { path: 'studios', component: StubPageComponent },
                    { path: 'studios/:id', component: StubPageComponent },
                    { path: 'account/bookings', component: StubPageComponent },
                    { path: 'owner', component: StubPageComponent },
                    { path: 'login', component: StubPageComponent },
                ]),
            ],
        });
    });

    async function renderAt(url: string): Promise<HTMLElement> {
        const fixture = TestBed.createComponent(HeaderComponent);
        await TestBed.inject(Router).navigateByUrl(url);
        await fixture.whenStable();
        return fixture.nativeElement as HTMLElement;
    }

    function link(root: HTMLElement, text: string): HTMLAnchorElement | undefined {
        return [...root.querySelectorAll<HTMLAnchorElement>('nav a')].find(
            (a) => a.textContent?.trim() === text,
        );
    }

    it('routerLink — обычная ссылка с href', async () => {
        const root = await renderAt('/');

        expect(link(root, 'Студии')?.getAttribute('href')).toBe('/studios');
        expect(root.querySelector('.logo')?.getAttribute('href')).toBe('/');
    });

    it('routerLinkActive: класс и aria-current только у текущего раздела', async () => {
        const root = await renderAt('/account/bookings');

        expect(link(root, 'Кабинет')?.classList).toContain('active');
        expect(link(root, 'Кабинет')?.getAttribute('aria-current')).toBe('page');
        expect(link(root, 'Студии')?.classList).not.toContain('active');
        expect(link(root, 'Студии')?.hasAttribute('aria-current')).toBe(false);
    });

    it('раздел «Студии» активен и на странице студии', async () => {
        const root = await renderAt('/studios/sound-garden');

        expect(link(root, 'Студии')?.classList).toContain('active');
    });

    it('гость видит «Войти», ссылки «Владельцу» нет', async () => {
        const root = await renderAt('/');

        expect(root.querySelector('.sign-in')?.getAttribute('href')).toBe('/login');
        expect(link(root, 'Владельцу')).toBeUndefined();
    });

    it('при ошибке сервера выход всё равно закрывает локальную сессию', async () => {
        const session = TestBed.inject(SessionStore);
        session.signIn('owner');
        const root = await renderAt('/owner');
        root.querySelector<HTMLButtonElement>('.sign-out')?.click();
        TestBed.inject(HttpTestingController)
            .expectOne('api/auth/logout')
            .flush(null, { status: 500, statusText: 'Error' });
        await vi.waitFor(() => expect(TestBed.inject(Router).url).toBe('/'));
        expect(session.accessToken()).toBeNull();
    });

    it('владелец видит свой раздел, «Выйти» завершает сессию и ведёт на главную', async () => {
        TestBed.inject(SessionStore).signIn('owner');
        const fixture = TestBed.createComponent(HeaderComponent);
        await TestBed.inject(Router).navigateByUrl('/owner');
        await fixture.whenStable();
        const root = fixture.nativeElement as HTMLElement;

        expect(link(root, 'Владельцу')?.classList).toContain('active');

        root.querySelector<HTMLButtonElement>('.sign-out')?.click();
        TestBed.inject(HttpTestingController).expectOne('api/auth/logout').flush(null);
        await fixture.whenStable();

        expect(TestBed.inject(SessionStore).isSignedIn()).toBe(false);
        expect(TestBed.inject(Router).url).toBe('/');
        expect(root.querySelector('.sign-in')).not.toBeNull();
    });
});
