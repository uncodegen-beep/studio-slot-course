import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DEMO_STUDIOS } from '@entities/studio/model/studios.demo';

import { provideRuLocale } from '@shared/lib/locale/provide-ru-locale';
import type { Studio } from '@shared/model';

import { StudioPageComponent } from './studio-page.component';

const [SOUND_GARDEN] = DEMO_STUDIOS as [Studio, ...Studio[]];

function setup(id: string): {
    fixture: ComponentFixture<StudioPageComponent>;
    http: HttpTestingController;
    root: HTMLElement;
} {
    TestBed.configureTestingModule({
        providers: [
            provideHttpClient(),
            provideHttpClientTesting(),
            provideRouter([]),
            provideRuLocale(),
        ],
    });
    const fixture = TestBed.createComponent(StudioPageComponent);
    fixture.componentRef.setInput('id', id);
    fixture.detectChanges();
    return {
        fixture,
        http: TestBed.inject(HttpTestingController),
        root: fixture.nativeElement as HTMLElement,
    };
}

describe('StudioPageComponent', () => {
    it('спиннер, затем данные студии', async () => {
        const { fixture, http, root } = setup('sound-garden');
        TestBed.tick();

        const request = http.expectOne('api/studios/sound-garden.json');
        expect(root.querySelector('app-spinner')).not.toBeNull();

        request.flush(SOUND_GARDEN);
        await fixture.whenStable();

        expect(root.querySelector('h1')?.textContent).toContain('Sound Garden');
        expect(root.querySelectorAll('.rooms li')).toHaveLength(3);
        http.verify();
    });

    it('ошибка — сообщение и «Повторить» отправляет запрос заново', async () => {
        const { fixture, http, root } = setup('nope');
        TestBed.tick();

        http.expectOne('api/studios/nope.json').flush('Not found', {
            status: 404,
            statusText: 'Not Found',
        });
        await fixture.whenStable();
        expect(root.querySelector('[role="alert"]')?.textContent).toContain('Не удалось загрузить');

        root.querySelector<HTMLButtonElement>('button')?.click();
        TestBed.tick();
        http.expectOne('api/studios/nope.json');
    });

    it('смена id отменяет незавершённый запрос и отправляет новый', () => {
        const { fixture, http } = setup('sound-garden');
        TestBed.tick();
        const first = http.expectOne('api/studios/sound-garden.json');

        fixture.componentRef.setInput('id', 'nevsky-beat');
        TestBed.tick();

        expect(first.cancelled).toBe(true);
        http.expectOne('api/studios/nevsky-beat.json');
    });
});
