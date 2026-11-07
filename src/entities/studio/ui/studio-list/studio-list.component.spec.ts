import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type { Studio } from '@shared/model';

import { DEMO_STUDIOS } from '../../model/studios.demo';
import { StudioListComponent } from './studio-list.component';

@Component({
    imports: [StudioListComponent],
    template: `
        <app-studio-list
            class="default"
            [studios]="studios"
        />
        <app-studio-list
            class="custom"
            [studios]="studios"
            [itemTemplate]="compact"
        />
        <app-studio-list
            class="none"
            [studios]="[]"
        />

        <ng-template
            #compact
            let-studio
        >
            <strong>{{ studio.name }}</strong>
        </ng-template>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class HostComponent {
    protected readonly studios: Studio[] = DEMO_STUDIOS;
}

function render(): HTMLElement {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
}

describe('StudioListComponent', () => {
    it('без itemTemplate рисует элементы шаблоном по умолчанию', () => {
        const items = render().querySelectorAll('.default li');

        expect(items).toHaveLength(DEMO_STUDIOS.length);
        expect(items[0]?.textContent).toContain('1. Sound Garden');
    });

    it('с itemTemplate рисует элементы переданным шаблоном', () => {
        const names = render().querySelectorAll('.custom li strong');

        expect(names).toHaveLength(DEMO_STUDIOS.length);
        expect(names[1]?.textContent).toBe('Nevsky Beat');
    });

    it('пустой список показывает emptyState', () => {
        const root = render();

        expect(root.querySelector('.none .empty')?.textContent).toContain('Студий не найдено');
        expect(root.querySelector('.none li')).toBeNull();
    });
});
