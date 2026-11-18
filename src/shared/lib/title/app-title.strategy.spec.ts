import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { formatTitle, provideAppTitleStrategy } from './app-title.strategy';

@Component({ template: '', changeDetection: ChangeDetectionStrategy.OnPush })
class StubPageComponent {}

describe('AppTitleStrategy', () => {
    it('formatTitle: страница — сервис, без страницы — заголовок по умолчанию', () => {
        expect(formatTitle('Студии')).toBe('Студии — StudioSlot');
        expect(formatTitle(undefined)).toBe('StudioSlot — студии по часам');
    });

    it('заголовок вкладки собирается из title маршрута', async () => {
        TestBed.configureTestingModule({
            providers: [
                provideRouter([
                    { path: '', component: StubPageComponent },
                    { path: 'studios', title: 'Студии', component: StubPageComponent },
                ]),
                provideAppTitleStrategy(),
            ],
        });
        const harness = await RouterTestingHarness.create('/studios');
        const title = TestBed.inject(Title);

        expect(title.getTitle()).toBe('Студии — StudioSlot');

        await harness.navigateByUrl('/');
        expect(title.getTitle()).toBe('StudioSlot — студии по часам');
    });
});
