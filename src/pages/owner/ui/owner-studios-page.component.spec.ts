import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SessionStore } from '@entities/session/model/session.store';
import { toStudioDto } from '@entities/studio/api/studio.dto';
import { DEMO_STUDIOS } from '@entities/studio/model/studios.demo';

import type { Studio } from '@shared/model';

import { OwnerStudiosPageComponent } from './owner-studios-page.component';

const [SOUND_GARDEN, NEVSKY_BEAT] = DEMO_STUDIOS as [Studio, Studio, ...Studio[]];

function setup(): {
    root: HTMLElement;
    http: HttpTestingController;
    render: () => Promise<void>;
} {
    const fixture = TestBed.createComponent(OwnerStudiosPageComponent);
    fixture.detectChanges();
    return {
        root: fixture.nativeElement as HTMLElement,
        http: TestBed.inject(HttpTestingController),
        // resource обновляет значение асинхронно: даём ему завершиться, потом проверяем вид.
        // Не whenStable: пока хоть один запрос без ответа, resource держит приложение «занятым»
        render: async () => {
            await new Promise((resolve) => setTimeout(resolve));
            fixture.detectChanges();
        },
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

    it('rxResource + forkJoin: список появляется, когда пришли все ответы', async () => {
        const { root, http, render } = setup();

        http.expectOne('api/studios/sound-garden').flush(toStudioDto(SOUND_GARDEN));
        await render();
        expect(root.querySelector('.loading')).not.toBeNull();

        http.expectOne('api/studios/nevsky-beat').flush(toStudioDto(NEVSKY_BEAT));
        await render();
        expect([...root.querySelectorAll('.studios a')].map((a) => a.textContent)).toEqual([
            'Sound Garden',
            'Nevsky Beat',
        ]);
    });

    it('один запрос упал — ошибка вместо списка', async () => {
        const { root, http, render } = setup();

        http.expectOne('api/studios/sound-garden').flush(toStudioDto(SOUND_GARDEN));
        http.expectOne('api/studios/nevsky-beat').flush('Server error', {
            status: 500,
            statusText: 'Server Error',
        });
        await render();

        expect(root.querySelector('.error')).not.toBeNull();
    });

    it('у клиента студий нет — пустой список без запросов', async () => {
        TestBed.inject(SessionStore).signIn('client');
        const { root, http, render } = setup();
        await render();

        http.expectNone(() => true);
        expect(root.querySelector('.studios li')?.textContent).toContain('Студий пока нет');
    });

    it('rxResource: «Повторить» после ошибки загружает заново', async () => {
        const { root, http, render } = setup();
        http.expectOne('api/studios/sound-garden').flush('Server error', {
            status: 500,
            statusText: 'Server Error',
        });
        http.expectOne('api/studios/nevsky-beat').flush(toStudioDto(NEVSKY_BEAT));
        await render();

        root.querySelector<HTMLButtonElement>('.error + button')?.click();
        await render();
        http.expectOne('api/studios/sound-garden').flush(toStudioDto(SOUND_GARDEN));
        // nevsky-beat ответил в первый раз — кэш StudiosApi (урок 58) отдаёт его без запроса
        await render();

        expect(root.querySelectorAll('.studios a')).toHaveLength(2);
    });
});
