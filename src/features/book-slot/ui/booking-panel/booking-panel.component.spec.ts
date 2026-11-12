import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DEMO_STUDIOS } from '@entities/studio/model/studios.demo';

import type { Studio } from '@shared/model';

import { BookingPanelComponent } from './booking-panel.component';

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
});
