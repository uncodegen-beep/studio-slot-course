import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { SessionStore } from '@entities/session/model/session.store';

import { AccountLayoutComponent } from './account-layout.component';

@Component({ template: '<h1>Бронирования</h1>', changeDetection: ChangeDetectionStrategy.OnPush })
class BookingsStubComponent {}

@Component({ template: '<h1>Избранное</h1>', changeDetection: ChangeDetectionStrategy.OnPush })
class FavoritesStubComponent {}

describe('AccountLayoutComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideRouter([
                    {
                        path: 'account',
                        component: AccountLayoutComponent,
                        children: [
                            { path: 'bookings', component: BookingsStubComponent },
                            { path: 'favorites', component: FavoritesStubComponent },
                        ],
                    },
                ]),
            ],
        });
        TestBed.inject(SessionStore).signIn('client');
    });

    it('дочерняя страница — во вложенном outlet, меню общее', async () => {
        const harness = await RouterTestingHarness.create('/account/favorites');
        const root = harness.routeNativeElement as HTMLElement;

        expect(root.querySelector('.page h1')?.textContent).toBe('Избранное');
        expect(root.querySelector('.menu .active')?.textContent?.trim()).toBe('Избранное');
    });

    it('относительные ссылки меню ведут внутрь /account', async () => {
        const harness = await RouterTestingHarness.create('/account/bookings');
        const links = [...(harness.routeNativeElement?.querySelectorAll('.menu a') ?? [])];

        expect(links.map((a) => a.getAttribute('href'))).toEqual([
            '/account/bookings',
            '/account/favorites',
        ]);
    });

    it('переход между дочерними страницами не пересоздаёт лэйаут', async () => {
        const harness = await RouterTestingHarness.create('/account/bookings');
        const layout = harness.routeDebugElement?.componentInstance as unknown;

        await harness.navigateByUrl('/account/favorites');

        expect(harness.routeDebugElement?.componentInstance).toBe(layout);
        expect(harness.routeNativeElement?.querySelector('.page h1')?.textContent).toBe(
            'Избранное',
        );
    });
});
