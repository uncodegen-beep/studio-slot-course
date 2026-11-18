// Задание модуля 04: страница своей студии в кабинете владельца — /owner/studios/:slug.
// Guard и resolver описаны интерфейсом ниже: тест компилируется, но падает, пока их не сделать.
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import {
    type CanActivateFn,
    type ResolveFn,
    Router,
    provideRouter,
    withComponentInputBinding,
} from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { routes } from '../../src/app/app.routes';
import { SessionStore } from '../../src/entities/session/model/session.store';
import { DEMO_STUDIOS } from '../../src/entities/studio/model/studios.demo';
import * as ownerStudio from '../../src/pages/owner/model/owner-studio';
import { provideRuLocale } from '../../src/shared/lib/locale/provide-ru-locale';
import { provideAppTitleStrategy } from '../../src/shared/lib/title/app-title.strategy';
import type { Studio } from '../../src/shared/model';

interface OwnerStudioTask {
    /** canActivate: своя студия — пускаем, чужая — UrlTree на /owner */
    ownsStudioGuard: CanActivateFn;
    /** Студия по :slug через StudiosApi; ошибка — RedirectCommand на /owner */
    ownerStudioResolver: ResolveFn<Studio>;
}

const task = ownerStudio as unknown as Partial<OwnerStudioTask>;
const [SOUND_GARDEN] = DEMO_STUDIOS as [Studio, ...Studio[]];

describe('Модуль 04 · страница своей студии', () => {
    beforeEach(() => {
        localStorage.clear();
        TestBed.configureTestingModule({
            providers: [
                provideRouter(routes, withComponentInputBinding()),
                provideAppTitleStrategy(),
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRuLocale(),
            ],
        });
        TestBed.inject(SessionStore).signIn('owner');
    });

    it('ownsStudioGuard и ownerStudioResolver экспортированы из owner-studio.ts', () => {
        expect(typeof task.ownsStudioGuard).toBe('function');
        expect(typeof task.ownerStudioResolver).toBe('function');
    });

    it('своя студия: страница с данными и заголовок вкладки', async () => {
        const harness = await RouterTestingHarness.create();
        const http = TestBed.inject(HttpTestingController);

        const navigation = harness.navigateByUrl('/owner/studios/sound-garden');
        const request = await vi.waitFor(() => http.expectOne('api/studios/sound-garden.json'));
        request.flush(SOUND_GARDEN);
        await navigation;

        const root = harness.routeNativeElement as HTMLElement;
        expect(root.querySelector('.page h1')?.textContent).toContain('Sound Garden');
        expect(TestBed.inject(Title).getTitle()).toBe('Sound Garden — StudioSlot');
    });

    it('чужая студия — обратно в /owner, запрос даже не отправляется', async () => {
        await RouterTestingHarness.create('/owner/studios/volga-records');

        expect(TestBed.inject(Router).url).toBe('/owner');
        TestBed.inject(HttpTestingController).expectNone('api/studios/volga-records.json');
    });

    it('сервер не ответил — обратно в /owner', async () => {
        const harness = await RouterTestingHarness.create();
        const http = TestBed.inject(HttpTestingController);

        void harness.navigateByUrl('/owner/studios/nevsky-beat');
        const request = await vi.waitFor(() => http.expectOne('api/studios/nevsky-beat.json'));
        request.flush('Server error', { status: 500, statusText: 'Server Error' });
        await harness.fixture.whenStable();

        expect(TestBed.inject(Router).url).toBe('/owner');
    });
});
