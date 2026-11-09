import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { provideRuLocale } from '@shared/lib/locale/provide-ru-locale';

import { AppComponent } from './app';

describe('AppComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppComponent],
            providers: [provideRouter([]), provideRuLocale()],
        }).compileComponents();
    });

    it('показывает шапку с названием проекта', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();

        const logo = (fixture.nativeElement as HTMLElement).querySelector('app-header .logo');
        expect(logo?.textContent).toContain('StudioSlot');
    });

    it('показывает карточку студии с названием и ценой', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();

        const card = (fixture.nativeElement as HTMLElement).querySelector('app-studio-card');
        expect(card?.querySelector('.card__title')?.textContent).toContain('Sound Garden');
        expect(card?.querySelector('.card__meta')?.textContent).toMatch(/1\s500\s₽\/час/);
    });
});
