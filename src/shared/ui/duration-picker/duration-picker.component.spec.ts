import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DurationPickerComponent } from './duration-picker.component';

@Component({
    imports: [DurationPickerComponent],
    template: `<app-duration-picker [(value)]="hours" />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class HostComponent {
    readonly hours = signal(2);
}

describe('DurationPickerComponent', () => {
    it('[(value)]: клик внутри меняет сигнал родителя, и наоборот', async () => {
        const fixture = TestBed.createComponent(HostComponent);
        await fixture.whenStable();
        const root = fixture.nativeElement as HTMLElement;
        const pressed = (): string | undefined =>
            [...root.querySelectorAll('button')]
                .find((button) => button.getAttribute('aria-pressed') === 'true')
                ?.textContent?.trim();

        expect(pressed()).toBe('2 ч');

        [...root.querySelectorAll('button')][2]?.click();
        await fixture.whenStable();
        expect(fixture.componentInstance.hours()).toBe(3);

        fixture.componentInstance.hours.set(1);
        await fixture.whenStable();
        expect(pressed()).toBe('1 ч');
    });
});
