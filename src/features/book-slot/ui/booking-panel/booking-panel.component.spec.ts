import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideBookingConfig } from '@features/book-slot/model/booking-config';

import { SessionStore } from '@entities/session/model/session.store';
import { DEMO_STUDIOS } from '@entities/studio/model/studios.demo';

import { NotifierService } from '@shared/lib/notify/notifier.service';
import type { Studio } from '@shared/model';

import { BookingPanelComponent, tomorrowAt } from './booking-panel.component';

@Component({
    imports: [BookingPanelComponent],
    template: `
        <app-booking-panel
            id="first"
            [studio]="studio"
        />
        <app-booking-panel
            id="second"
            [studio]="studio"
        />
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class HostComponent {
    protected readonly studio = DEMO_STUDIOS[0] as Studio;
}

describe('BookingPanelComponent', () => {
    // Панель отправляет заявку через BookingsApi — ему нужен HttpClient
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
    });

    it('providers: у каждой панели свой BookingDraftStore', async () => {
        const fixture = TestBed.createComponent(HostComponent);
        await fixture.whenStable();
        const root = fixture.nativeElement as HTMLElement;
        const total = (id: string): string =>
            root.querySelector(`#${id} .total`)?.textContent?.replace(/\s+/g, ' ') ?? '';

        const firstPicker = root.querySelectorAll<HTMLButtonElement>(
            '#first app-duration-picker button',
        );
        firstPicker[3]?.click();
        await fixture.whenStable();

        expect(total('first')).toContain('4 часа');
        expect(total('second')).toContain('2 часа');
    });

    it('у панелей разные группы радиокнопок', async () => {
        const fixture = TestBed.createComponent(HostComponent);
        await fixture.whenStable();
        const names = [
            ...(fixture.nativeElement as HTMLElement).querySelectorAll<HTMLInputElement>(
                'input[type="radio"]',
            ),
        ].map((radio) => radio.name);

        expect(new Set(names).size).toBe(2);
    });

    it('часы начала и длительности — из BOOKING_CONFIG', async () => {
        TestBed.configureTestingModule({
            providers: [provideBookingConfig({ openHour: 8, closeHour: 12, maxHours: 2 })],
        });
        const fixture = TestBed.createComponent(HostComponent);
        await fixture.whenStable();
        const root = fixture.nativeElement as HTMLElement;

        const options = [...root.querySelectorAll('#first select option')].map((option) =>
            option.textContent?.trim(),
        );
        expect(options).toEqual(['8:00', '10:00']);
        expect(root.querySelectorAll('#first app-duration-picker button')).toHaveLength(2);
    });

    it('tomorrowAt: завтрашняя дата и час с ведущими нулями', () => {
        expect(tomorrowAt(9, new Date(2026, 11, 31, 18, 30))).toBe('2027-01-01T09:00');
    });

    describe('отправка заявки', () => {
        it('владелец не может отправить заявку из панели', () => {
            TestBed.inject(SessionStore).signIn('owner');
            const fixture = TestBed.createComponent(HostComponent);
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('.submit')).toBeNull();
        });

        it('после ошибки клиент может повторить отправку', () => {
            TestBed.inject(SessionStore).signIn('client');
            const fixture = TestBed.createComponent(HostComponent);
            fixture.detectChanges();
            const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
                '#first .submit',
            );
            const http = TestBed.inject(HttpTestingController);
            button?.click();
            http.expectOne('api/bookings').flush(null, { status: 503, statusText: 'Unavailable' });
            fixture.detectChanges();
            expect(button?.getAttribute('aria-busy')).toBe('false');
            button?.click();
            http.expectOne('api/bookings').flush({ studioName: 'Sound Garden' });
        });

        it('exhaustMap: три быстрых клика — один POST', () => {
            TestBed.inject(SessionStore).signIn('client');
            const fixture = TestBed.createComponent(HostComponent);
            fixture.detectChanges();
            const http = TestBed.inject(HttpTestingController);
            const notices: string[] = [];
            TestBed.inject(NotifierService).notices$.subscribe((notice) =>
                notices.push(notice.text),
            );
            const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
                '#first .submit',
            );

            button?.click();
            button?.click();
            button?.click();
            fixture.detectChanges();
            expect(button?.textContent?.trim()).toBe('Отправляем…');

            const post = http.expectOne('api/bookings');
            expect(post.request.method).toBe('POST');
            expect(post.request.body).toMatchObject({ studioName: 'Sound Garden', hours: 2 });
            post.flush({ ...post.request.body, id: 'b-1', discount: 0, status: 'PENDING' });
            fixture.detectChanges();
            expect(notices).toEqual(['Заявка в Sound Garden отправлена']);
            expect(button?.textContent?.trim()).toBe('Отправить заявку');

            // Первая заявка завершилась — следующий клик снова отправляет
            button?.click();
            http.expectOne('api/bookings').flush({ id: 'b-2', studioName: 'Sound Garden' });
            expect(notices).toHaveLength(2);
        });
    });
});
