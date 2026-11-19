import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SessionStore } from '@entities/session/model/session.store';
import { DEMO_STUDIOS } from '@entities/studio/model/studios.demo';

import type { Studio } from '@shared/model';

import { OwnerStudiosPageComponent } from './owner-studios-page.component';

const [SOUND_GARDEN, NEVSKY_BEAT] = DEMO_STUDIOS as [Studio, Studio, ...Studio[]];

function setup(): { root: HTMLElement; http: HttpTestingController; render: () => void } {
    const fixture = TestBed.createComponent(OwnerStudiosPageComponent);
    fixture.detectChanges();
    return {
        root: fixture.nativeElement as HTMLElement,
        http: TestBed.inject(HttpTestingController),
        render: () => fixture.detectChanges(),
    };
}

describe('OwnerStudiosPageComponent', () => {
    beforeEach(() => {
        localStorage.clear();
        TestBed.configureTestingModule({
            providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
        });
        TestBed.inject(SessionStore).signIn('owner');
    });

    it('forkJoin: список появляется, когда пришли все ответы', () => {
        const { root, http, render } = setup();

        http.expectOne('api/studios/sound-garden.json').flush(SOUND_GARDEN);
        render();
        expect(root.querySelector('.loading')).not.toBeNull();

        http.expectOne('api/studios/nevsky-beat.json').flush(NEVSKY_BEAT);
        render();
        expect([...root.querySelectorAll('.studios a')].map((a) => a.textContent)).toEqual([
            'Sound Garden',
            'Nevsky Beat',
        ]);
    });

    it('один запрос упал — ошибка вместо списка', () => {
        const { root, http, render } = setup();

        http.expectOne('api/studios/sound-garden.json').flush(SOUND_GARDEN);
        http.expectOne('api/studios/nevsky-beat.json').flush('Server error', {
            status: 500,
            statusText: 'Server Error',
        });
        render();

        expect(root.querySelector('.error')).not.toBeNull();
    });

    it('у клиента студий нет — пустой список без запросов', () => {
        TestBed.inject(SessionStore).signIn('client');
        const { root, http } = setup();

        http.expectNone(() => true);
        expect(root.querySelector('.studios li')?.textContent).toContain('Студий пока нет');
    });
});
