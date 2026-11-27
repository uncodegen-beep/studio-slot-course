import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { DEMO_STUDIOS } from '@entities/studio/model/studios.demo';

import type { Studio } from '@shared/model';

import { studioResolver } from './studio.resolver';

const [SOUND_GARDEN] = DEMO_STUDIOS as [Studio, ...Studio[]];

@Component({
    template: '<h1>{{ studio()?.name }}</h1>',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class StudioStubComponent {
    readonly studio = input<Studio>();
}

@Component({ template: '<h1>Не найдено</h1>', changeDetection: ChangeDetectionStrategy.OnPush })
class NotFoundStubComponent {}

describe('studioResolver', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter(
                    [
                        { path: 'not-found', component: NotFoundStubComponent },
                        {
                            path: 'studios/:id',
                            resolve: { studio: studioResolver },
                            component: StudioStubComponent,
                        },
                    ],
                    withComponentInputBinding(),
                ),
            ],
        });
    });

    it('страница появляется только после ответа, данные — во входе studio', async () => {
        const harness = await RouterTestingHarness.create();
        const http = TestBed.inject(HttpTestingController);

        const navigation = harness.navigateByUrl('/studios/sound-garden');
        const request = await vi.waitFor(() => http.expectOne('api/studios/sound-garden'));
        // Пока ответа нет — переход не завершён
        expect(TestBed.inject(Router).url).toBe('/');

        request.flush(SOUND_GARDEN);
        await navigation;

        expect(TestBed.inject(Router).url).toBe('/studios/sound-garden');
        expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Sound Garden');
    });

    it('ошибка загрузки — RedirectCommand на 404', async () => {
        const harness = await RouterTestingHarness.create();
        const http = TestBed.inject(HttpTestingController);

        void harness.navigateByUrl('/studios/nope');
        const request = await vi.waitFor(() => http.expectOne('api/studios/nope'));
        request.flush('Not found', { status: 404, statusText: 'Not Found' });
        await harness.fixture.whenStable();

        expect(TestBed.inject(Router).url).toBe('/not-found');
        expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Не найдено');
    });
});
