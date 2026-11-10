import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { DEMO_STUDIOS } from '@entities/studio/model/studios.demo';

import { provideRuLocale } from '@shared/lib/locale/provide-ru-locale';
import type { Studio } from '@shared/model';

import { StudioCardComponent } from './studio-card.component';

const [OPEN_STUDIO, , CLOSED_STUDIO] = DEMO_STUDIOS as [Studio, Studio, Studio];

function render(studio: Studio, favorite = false): ComponentFixture<StudioCardComponent> {
    const fixture = TestBed.createComponent(StudioCardComponent);
    // setInput — как [studio]="…" у родителя: OnPush-компонент узнаёт о новом входе
    fixture.componentRef.setInput('studio', studio);
    fixture.componentRef.setInput('favorite', favorite);
    fixture.detectChanges();
    return fixture;
}

describe('StudioCardComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [provideRuLocale()] });
    });

    it('@Input: рисует переданную студию', () => {
        const host = render(OPEN_STUDIO).nativeElement as HTMLElement;

        expect(host.querySelector('.card__title')?.textContent).toContain('Sound Garden');
        expect(host.querySelector('.card__meta')?.textContent).toMatch(/от 1\s500\s₽\/час/);
    });

    it('number: рейтинг текстом с одним знаком после запятой', () => {
        const host = render(OPEN_STUDIO).nativeElement as HTMLElement;

        expect(host.querySelector('.card__rating')?.textContent?.trim()).toBe('Рейтинг 4,6 из 5');
    });

    it('compact: без обложки и с классом на хосте', () => {
        const fixture = TestBed.createComponent(StudioCardComponent);
        fixture.componentRef.setInput('studio', OPEN_STUDIO);
        fixture.componentRef.setInput('compact', '');
        fixture.detectChanges();
        const host = fixture.nativeElement as HTMLElement;

        expect(host.classList).toContain('compact');
        expect(host.querySelector('img')).toBeNull();
    });

    it('ngOnChanges: полоса рейтинга пересчитывается при новой студии на входе', () => {
        const fixture = render(OPEN_STUDIO);
        const bar = (): string | undefined =>
            (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('.card__rating-bar')
                ?.style.width;

        expect(bar()).toBe('92%');

        fixture.componentRef.setInput('studio', { ...OPEN_STUDIO, rating: 4 });
        fixture.detectChanges();

        expect(bar()).toBe('80%');
    });

    it('host в декораторе ставит классы состояния на сам тег', () => {
        expect((render(OPEN_STUDIO).nativeElement as HTMLElement).classList).toContain('featured');
        expect((render(CLOSED_STUDIO).nativeElement as HTMLElement).classList).toContain('closed');
    });

    it('Emulated: элементы шаблона помечены атрибутом _ngcontent-*', () => {
        const card = (render(OPEN_STUDIO).nativeElement as HTMLElement).querySelector('.card');

        const marker = card?.getAttributeNames().find((name) => name.startsWith('_ngcontent-'));
        expect(marker).toBeDefined();
    });

    it('@Output: по клику на сердечко сообщает id студии', () => {
        const fixture = render(OPEN_STUDIO);
        const emitted: string[] = [];
        fixture.componentInstance.favoriteToggle.subscribe((id) => emitted.push(id));

        (fixture.nativeElement as HTMLElement)
            .querySelector<HTMLButtonElement>('[aria-pressed]')
            ?.click();

        expect(emitted).toEqual(['sound-garden']);
    });

    it('favorite: заполненное сердечко и aria-pressed', () => {
        const host = render(OPEN_STUDIO, true).nativeElement as HTMLElement;

        expect(host.querySelector('[aria-pressed]')?.getAttribute('aria-pressed')).toBe('true');
        expect(host.querySelector('use')?.getAttribute('href')).toBe(
            'icons/sprite.svg#heart-filled',
        );
    });
});
