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

    it('loadChildren: раздел /account — бронирования и избранное', async () => {
        const harness = await RouterTestingHarness.create('/account');

        expect(TestBed.inject(Router).url).toBe('/account/bookings');
        expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain(
            'Мои бронирования',
        );
        expect(TestBed.inject(Title).getTitle()).toBe('Мои бронирования — StudioSlot');

        await harness.navigateByUrl('/account/favorites');

        expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain('Избранное');
        // Вложенный маршрут: страница внутри лэйаута кабинета
        expect(harness.routeNativeElement?.querySelector('.page h1')).not.toBeNull();
    });

    it('старый адрес /bookings ведёт в кабинет', async () => {
        await RouterTestingHarness.create('/bookings');

        expect(TestBed.inject(Router).url).toBe('/account/bookings');
    });

    it('неизвестный адрес — редирект на главную', async () => {
        await RouterTestingHarness.create('/no-such-page');

        expect(TestBed.inject(Router).url).toBe('/');
    });

    it('"**" — последний: всё, что ниже него, недостижимо', () => {
        expect(routes.at(-1)?.path).toBe('**');
    });
});
