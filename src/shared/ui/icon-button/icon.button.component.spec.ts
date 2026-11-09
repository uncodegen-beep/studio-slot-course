import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { IconButtonComponent } from './icon-button.component';

@Component({
    imports: [IconButtonComponent],
    template: `<button
        type="button"
        app-icon-button
        label="В избранное"
    >
        +
    </button>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class HostComponent {}

describe('IconButtonComponent', () => {
    it('label уходит и в aria-label, и в подсказку встроенной директивы', async () => {
        const fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
        const button = (fixture.nativeElement as HTMLElement).querySelector('button');

        expect(button?.getAttribute('aria-label')).toBe('В избранное');

        button?.dispatchEvent(new MouseEvent('mouseenter'));
        await fixture.whenStable();

        expect(document.querySelector('[role="tooltip"]')?.textContent).toBe('В избранное');
        fixture.destroy();
    });
});
