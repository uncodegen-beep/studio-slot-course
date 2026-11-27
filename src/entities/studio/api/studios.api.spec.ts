import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { toStudioDto } from '@entities/studio/api/studio.dto';
import { DEMO_STUDIOS } from '@entities/studio/model/studios.demo';

import type { Studio } from '@shared/model';

import { StudiosApi } from './studios.api';

const [SOUND_GARDEN] = DEMO_STUDIOS as [Studio, ...Studio[]];
const URL = 'api/studios/sound-garden';

describe('StudiosApi', () => {
    let api: StudiosApi;
    let http: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        api = TestBed.inject(StudiosApi);
        http = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        http.verify();
    });

    it('getById — GET /api/studios/:id', () => {
        let name = '';

        api.getById('nevsky-beat').subscribe((studio) => (name = studio.name));
        http.expectOne('api/studios/nevsky-beat').flush({ name: 'Nevsky Beat' });

        expect(name).toBe('Nevsky Beat');
    });

    it('один экземпляр на приложение — один кэш на всех', () => {
        expect(TestBed.inject(StudiosApi)).toBe(api);
    });

    it('shareReplay: два подписчика — один запрос', () => {
        const names: string[] = [];

        api.getById('sound-garden').subscribe((studio) => names.push(studio.name));
        api.getById('sound-garden').subscribe((studio) => names.push(studio.name));
        http.expectOne(URL).flush(toStudioDto(SOUND_GARDEN));

        expect(names).toEqual(['Sound Garden', 'Sound Garden']);
    });

    it('опоздавший подписчик получает сохранённый ответ без запроса', () => {
        api.getById('sound-garden').subscribe();
        http.expectOne(URL).flush(toStudioDto(SOUND_GARDEN));

        let late: Studio | undefined;
        api.getById('sound-garden').subscribe((studio) => (late = studio));

        expect(late?.id).toBe('sound-garden');
        http.expectNone(URL);
    });

    it('ошибка не кэшируется: следующая подписка идёт в сеть', () => {
        api.getById('sound-garden').subscribe({ error: () => undefined });
        http.expectOne(URL).flush('Server error', { status: 500, statusText: 'Server Error' });

        api.getById('sound-garden').subscribe();
        http.expectOne(URL).flush(toStudioDto(SOUND_GARDEN));
    });

    it('invalidate — следующий вызов делает новый запрос', () => {
        api.getById('sound-garden').subscribe();
        http.expectOne(URL).flush(toStudioDto(SOUND_GARDEN));

        api.invalidate('sound-garden');
        api.getById('sound-garden').subscribe();
        http.expectOne(URL).flush(toStudioDto(SOUND_GARDEN));
    });

    it('search — GET /api/studios?q=, фильтрует сервер', () => {
        let names: string[] = [];

        api.search('казань').subscribe((studios) => (names = studios.map((studio) => studio.name)));
        const request = http.expectOne(
            (req) => req.url === 'api/studios' && req.params.get('q') === 'казань',
        );
        request.flush(DEMO_STUDIOS.filter((studio) => studio.city === 'Казань'));

        expect(request.request.method).toBe('GET');
        expect(names).toEqual(['Volga Records']);
    });

    it('update — PUT студии целиком и сброс кэша', () => {
        api.getById('sound-garden').subscribe();
        http.expectOne(URL).flush(toStudioDto(SOUND_GARDEN));

        api.update({ ...SOUND_GARDEN, description: 'Есть парковка' }).subscribe();
        const put = http.expectOne(URL);
        expect(put.request.method).toBe('PUT');
        expect(put.request.body).toMatchObject({
            id: 'sound-garden',
            description: 'Есть парковка',
        });
        put.flush({ ...SOUND_GARDEN, description: 'Есть парковка' });

        // Кэш сброшен — свежие данные с сервера
        api.getById('sound-garden').subscribe();
        http.expectOne(URL).flush(toStudioDto(SOUND_GARDEN));
    });
});
