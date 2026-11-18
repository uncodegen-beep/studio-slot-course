import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { HeaderComponent } from './header.component';

@Component({ template: '', changeDetection: ChangeDetectionStrategy.OnPush })
class StubPageComponent {}

describe('HeaderComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideRouter([
                    { path: '', component: StubPageComponent },
                    { path: 'studios', component: StubPageComponent },
                    { path: 'studios/:id', component: StubPageComponent },
                    { path: 'bookings', component: StubPageComponent },
                ]),
            ],
        });
    });

    async function renderAt(url: string): Promise<HTMLElement> {
        const fixture = TestBed.createComponent(HeaderComponent);
        await TestBed.inject(Router).navigateByUrl(url);
        await fixture.whenStable();
        return fixture.nativeElement as HTMLElement;
    }

    function link(root: HTMLElement, text: string): HTMLAnchorElement | undefined {
        return [...root.querySelectorAll<HTMLAnchorElement>('nav a')].find(
            (a) => a.textContent?.trim() === text,
        );
    }

    it('routerLink — обычная ссылка с href', async () => {
        const root = await renderAt('/');

        expect(link(root, 'Студии')?.getAttribute('href')).toBe('/studios');
        expect(root.querySelector('.logo')?.getAttribute('href')).toBe('/');
    });

    it('routerLinkActive: класс и aria-current только у текущего раздела', async () => {
        const root = await renderAt('/bookings');

        expect(link(root, 'Мои бронирования')?.classList).toContain('active');
        expect(link(root, 'Мои бронирования')?.getAttribute('aria-current')).toBe('page');
        expect(link(root, 'Студии')?.classList).not.toContain('active');
        expect(link(root, 'Студии')?.hasAttribute('aria-current')).toBe(false);
    });

    it('раздел «Студии» активен и на странице студии', async () => {
        const root = await renderAt('/studios/sound-garden');

        expect(link(root, 'Студии')?.classList).toContain('active');
    });
});
