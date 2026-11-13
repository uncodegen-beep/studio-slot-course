import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { FieldGroupComponent } from './field-group.component';

@Component({
    imports: [FieldGroupComponent],
    template: `
        <app-field-group legend="Фильтры">
            <app-field-group legend="Цена">
                <app-field-group legend="Скидки" />
            </app-field-group>
        </app-field-group>
        <app-field-group legend="Отдельно" />
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class HostComponent {}

describe('FieldGroupComponent', () => {
    it('skipSelf + optional: уровень вложенности считается от родительской группы', () => {
        const fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
        const depths = [
            ...(fixture.nativeElement as HTMLElement).querySelectorAll('app-field-group'),
        ].map((group) => [
            group.querySelector('legend')?.textContent,
            group.getAttribute('data-depth'),
        ]);

        expect(depths).toEqual([
            ['Фильтры', '0'],
            ['Цена', '1'],
            ['Скидки', '2'],
            ['Отдельно', '0'],
        ]);
    });
});
