import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { SessionStore, type SessionUser } from '@entities/session/model/session.store';

import { ownsStudio, ownsStudioGuard } from './owner-studio';

@Component({ template: '', changeDetection: ChangeDetectionStrategy.OnPush })
class StubPageComponent {}

const OWNER: SessionUser = { name: 'Владелец', role: 'owner', studioIds: ['sound-garden'] };
const CLIENT: SessionUser = { name: 'Клиент', role: 'client', studioIds: ['sound-garden'] };

describe('ownsStudio', () => {
    it('владелец — только свои студии', () => {
        expect(ownsStudio(OWNER, 'sound-garden')).toBe(true);
        expect(ownsStudio(OWNER, 'volga-records')).toBe(false);
    });

    it('клиент и гость — никогда, даже с таким id в списке', () => {
        expect(ownsStudio(CLIENT, 'sound-garden')).toBe(false);
        expect(ownsStudio(null, 'sound-garden')).toBe(false);
    });

    it('ownsStudioGuard: чужая студия — UrlTree на /owner', async () => {
        localStorage.clear();
        TestBed.configureTestingModule({
            providers: [
                provideRouter([
                    { path: 'owner', component: StubPageComponent },
                    {
                        path: 'owner/studios/:slug',
                        canActivate: [ownsStudioGuard],
                        component: StubPageComponent,
                    },
                ]),
            ],
        });
        TestBed.inject(SessionStore).signIn('owner');
        const harness = await RouterTestingHarness.create('/owner/studios/sound-garden');
        const router = TestBed.inject(Router);

        expect(router.url).toBe('/owner/studios/sound-garden');

        await harness.navigateByUrl('/owner/studios/volga-records');
        expect(router.url).toBe('/owner');
    });
});
