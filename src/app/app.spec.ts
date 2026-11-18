import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { provideRuLocale } from '@shared/lib/locale/provide-ru-locale';

import { AppComponent } from './app';
import { routes } from './app.routes';

describe('AppComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppComponent],
            providers: [provideRouter(routes, withComponentInputBinding()), provideRuLocale()],
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

    it('пустой путь — главная со своим заголовком вкладки', async () => {
        const harness = await RouterTestingHarness.create('/');

        expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain(
            'Студии для репетиций',
        );
        expect(TestBed.inject(Title).getTitle()).toBe('StudioSlot — студии по часам');
    });

    it('/studios — каталог, а не страница студии с :id', async () => {
        const harness = await RouterTestingHarness.create('/studios');

        expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain(
            'Каталог студий',
        );
        expect(TestBed.inject(Title).getTitle()).toBe('Студии — StudioSlot');
    });

    it('ссылка с главной: город из адреса попадает во вход каталога', async () => {
        const harness = await RouterTestingHarness.create('/');
        const kazan = [
            ...(harness.routeNativeElement?.querySelectorAll<HTMLAnchorElement>('.cities a') ?? []),
        ].find((a) => a.textContent?.trim() === 'Казань');

        kazan?.click();
        await harness.fixture.whenStable();

        expect(decodeURIComponent(TestBed.inject(Router).url)).toBe('/studios?city=Казань');
        expect(harness.routeNativeElement?.querySelectorAll('app-studio-list li')).toHaveLength(1);
    });

    it('у бронирований своя страница', async () => {
        const harness = await RouterTestingHarness.create('/bookings');

        expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain(
            'Мои бронирования',
        );
        expect(TestBed.inject(Title).getTitle()).toBe('Мои бронирования — StudioSlot');
    });

    it('неизвестный адрес — редирект на главную', async () => {
        await RouterTestingHarness.create('/no-such-page');

        expect(TestBed.inject(Router).url).toBe('/');
    });

    it('"**" — последний: всё, что ниже него, недостижимо', () => {
        expect(routes.at(-1)?.path).toBe('**');
    });
});
