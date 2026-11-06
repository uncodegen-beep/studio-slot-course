import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app';

describe('AppComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppComponent],
            providers: [provideRouter([])],
        }).compileComponents();
    });

    it('показывает шапку с названием проекта', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();

        const logo = (fixture.nativeElement as HTMLElement).querySelector('h1');
        expect(logo?.textContent).toContain('app-header .logo');
    });
});
