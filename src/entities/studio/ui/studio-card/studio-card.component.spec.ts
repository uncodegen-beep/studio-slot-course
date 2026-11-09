import { TestBed } from '@angular/core/testing';

import { StudioCardComponent } from './studio-card.component';

function render(): HTMLElement {
    const fixture = TestBed.createComponent(StudioCardComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
}

describe('StudioCardComponent', () => {
    it('host в декораторе ставит классы состояния на сам тег', () => {
        const host = render();

        expect(host.classList).toContain('featured');
        expect(host.classList).not.toContain('closed');
        expect(host.classList).not.toContain('new');
    });

    it('Emulated: элементы шаблона помечены атрибутом _ngcontent-*', () => {
        const card = render().querySelector('.card');

        const marker = [...(card?.getAttributeNames() ?? [])].find((name) =>
            name.startsWith('_ngcontent-'),
        );
        expect(marker).toBeDefined();
    });
});
