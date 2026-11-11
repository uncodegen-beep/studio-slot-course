import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { StudiosApi } from './studios.api';

describe('StudiosApi', () => {
    it('getById запрашивает JSON студии', () => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        const api = TestBed.inject(StudiosApi);
        const http = TestBed.inject(HttpTestingController);
        let name = '';

        api.getById('nevsky-beat').subscribe((studio) => (name = studio.name));
        http.expectOne('api/studios/nevsky-beat.json').flush({ name: 'Nevsky Beat' });

        expect(name).toBe('Nevsky Beat');
        http.verify();
    });

    it('один экземпляр на приложение', () => {
        TestBed.configureTestingModule({ providers: [provideHttpClient()] });

        expect(TestBed.inject(StudiosApi)).toBe(TestBed.inject(StudiosApi));
    });
});
