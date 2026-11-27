import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { DEMO_STUDIOS } from '@entities/studio/model/studios.demo';

import { provideRuLocale } from '@shared/lib/locale/provide-ru-locale';
import type { Studio } from '@shared/model';

import { StudioPageComponent } from './studio-page.component';

const [SOUND_GARDEN, , VOLGA] = DEMO_STUDIOS as [Studio, Studio, Studio];

function render(studio: Studio): HTMLElement {
    TestBed.configureTestingModule({
        providers: [
            provideRouter([]),
            provideRuLocale(),
            provideHttpClient(),
            provideHttpClientTesting(),
        ],
    });
    const fixture = TestBed.createComponent(StudioPageComponent);
    // Так роутер передаёт результат resolver во вход
    fixture.componentRef.setInput('studio', studio);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
}

describe('StudioPageComponent', () => {
    it('сразу показывает студию: загрузку взял на себя resolver', () => {
        const root = render(SOUND_GARDEN);

        expect(root.querySelector('h1')?.textContent).toContain('Sound Garden');
        expect(root.querySelectorAll('.rooms li')).toHaveLength(3);
        expect(root.querySelector('app-booking-panel')).not.toBeNull();
    });

    it('закрытая студия — пометка в описании', () => {
        const root = render(VOLGA);

        expect(root.querySelector('.meta')?.textContent).toContain('сейчас закрыта');
    });

    it('заголовок вкладки — имя студии', () => {
        render(SOUND_GARDEN);

        expect(TestBed.inject(Title).getTitle()).toBe('Sound Garden — StudioSlot');
    });

    it('ссылки-якоря на разделы страницы', () => {
        const root = render(SOUND_GARDEN);
        const hrefs = [...root.querySelectorAll('.sections a')].map((a) => a.getAttribute('href'));

        expect(hrefs.every((href) => href?.includes('#'))).toBe(true);
        expect(hrefs.map((href) => href?.split('#')[1])).toEqual(['rooms', 'booking']);
        expect(root.querySelector('#rooms')).not.toBeNull();
        expect(root.querySelector('#booking')).not.toBeNull();
    });
});
