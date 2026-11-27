import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { SessionStore, demoUser } from '@entities/session/model/session.store';

import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptors([authInterceptor])),
                provideHttpClientTesting(),
                provideRouter([]),
            ],
        });
        TestBed.inject(SessionStore).signIn('client');
    });
    afterEach(() => TestBed.inject(HttpTestingController).verify());
    const unauthorized = { status: 401, statusText: 'Unauthorized' };
    it('повторяет параллельные запросы с одним новым токеном', () => {
        const http = TestBed.inject(HttpClient);
        const backend = TestBed.inject(HttpTestingController);
        const values: string[] = [];
        for (const path of ['first', 'second'])
            http.get<string>('api/' + path).subscribe((value) => values.push(value));
        for (const path of ['first', 'second'])
            backend.expectOne('api/' + path).flush(null, unauthorized);
        backend
            .expectOne('api/auth/refresh')
            .flush({ user: demoUser('client'), accessToken: 'new' });
        for (const path of ['first', 'second']) {
            const retry = backend.expectOne('api/' + path);
            expect(retry.request.headers.get('Authorization')).toBe('Bearer new');
            retry.flush(path);
        }
        expect(values).toEqual(['first', 'second']);
    });
    it('при отказе refresh завершает сессию и ведёт на вход', () => {
        const backend = TestBed.inject(HttpTestingController);
        const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
        const error = vi.fn();
        TestBed.inject(HttpClient).get('api/bookings').subscribe({ error });
        backend.expectOne('api/bookings').flush(null, unauthorized);
        backend.expectOne('api/auth/refresh').flush(null, unauthorized);
        expect(error).toHaveBeenCalledOnce();
        expect(TestBed.inject(SessionStore).isSignedIn()).toBe(false);
        expect(navigate).toHaveBeenCalledWith(['/login']);
    });
});
