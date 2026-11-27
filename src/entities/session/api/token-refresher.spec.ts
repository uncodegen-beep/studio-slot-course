import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TokenRefresher } from './token-refresher';

describe('TokenRefresher', () => {
    it('объединяет параллельные запросы и освобождает поток после ответа', () => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        const service = TestBed.inject(TokenRefresher),
            http = TestBed.inject(HttpTestingController);
        const tokens: string[] = [];
        service.refresh().subscribe((t) => tokens.push(t));
        service.refresh().subscribe((t) => tokens.push(t));
        const user = { name: 'Клиент', role: 'client', studioIds: [] };
        http.expectOne('api/auth/refresh').flush({ user, accessToken: 'first' });
        expect(tokens).toEqual(['first', 'first']);
        service.refresh().subscribe((t) => tokens.push(t));
        http.expectOne('api/auth/refresh').flush({ user, accessToken: 'second' });
        expect(tokens.at(-1)).toBe('second');
        http.verify();
    });
});
