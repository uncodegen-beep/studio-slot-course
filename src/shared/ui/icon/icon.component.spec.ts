import { TestBed } from '@angular/core/testing';

import { IconComponent } from './icon.component';

describe('IconComponent', () => {
    it('ссылается на символ спрайта по имени и задаёт размер', () => {
        const fixture = TestBed.createComponent(IconComponent);
        fixture.componentRef.setInput('name', 'heart');
        fixture.componentRef.setInput('size', 24);
        fixture.detectChanges();

        const svg = (fixture.nativeElement as HTMLElement).querySelector('svg');
        expect(svg?.getAttribute('width')).toBe('24');
        expect(svg?.getAttribute('aria-hidden')).toBe('true');
        expect(svg?.querySelector('use')?.getAttribute('href')).toBe('icons/sprite.svg#heart');
    });
});
