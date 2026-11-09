import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AutofocusDirective } from './autofocus.directive';

@Component({
    imports: [AutofocusDirective],
    template: `<input
        appAutofocus
        aria-label="Поиск"
    />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class HostComponent {}

describe('AutofocusDirective', () => {
    it('ставит фокус на элемент после рендера', async () => {
        const fixture = TestBed.createComponent(HostComponent);
        document.body.append(fixture.nativeElement as HTMLElement);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(document.activeElement).toBe(
            (fixture.nativeElement as HTMLElement).querySelector('input'),
        );
        (fixture.nativeElement as HTMLElement).remove();
    });
});
