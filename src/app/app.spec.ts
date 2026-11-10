import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { provideRuLocale } from '@shared/lib/locale/provide-ru-locale';

import { AppComponent } from './app';
import { routes } from './app.routes';

describe('AppComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppComponent],
            providers: [provideRouter(routes), provideRuLocale()],
        });
    });

    it('лэйаут: шапка, основная часть и подвал', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const root = fixture.nativeElement as HTMLElement;

        expect(root.querySelector('app-header .logo')?.textContent).toContain('StudioSlot');
        expect(root.querySelector('main router-outlet')).not.toBeNull();
        expect(root.querySelector('app-footer')?.textContent).toContain('Современный Angular');
    });

    it('корень перенаправляет на каталог студий', async () => {
        const harness = await RouterTestingHarness.create('/');

        expect(TestBed.inject(Router).url).toBe('/studios');
        expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain(
            'Каталог студий',
        );
    });

    it('у бронирований своя страница', async () => {
        const harness = await RouterTestingHarness.create('/bookings');

        expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain(
            'Мои бронирования',
        );
    });
});
