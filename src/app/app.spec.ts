import { TestBed } from '@angular/core/testing';

import { AppComponent } from './app';

describe('App', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppComponent],
        }).compileComponents();
    });

    it('создаётся и показывает название проекта', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();

        const title = (fixture.nativeElement as HTMLElement).querySelector('h1');
        expect(title?.textContent).toContain('StudioSlot');
    });
});
