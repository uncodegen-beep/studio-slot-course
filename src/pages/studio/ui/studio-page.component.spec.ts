import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DEMO_STUDIOS } from '@entities/studio/model/studios.demo';

import { provideRuLocale } from '@shared/lib/locale/provide-ru-locale';
import type { Studio } from '@shared/model';

import { StudioPageComponent } from './studio-page.component';

const [SOUND_GARDEN, , VOLGA] = DEMO_STUDIOS as [Studio, Studio, Studio];

function render(studio: Studio): HTMLElement {
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideRuLocale()] });
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
});
