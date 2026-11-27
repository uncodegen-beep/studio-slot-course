import { Component, computed, inject, input, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { StudiosApi } from '@entities/studio/api/studios.api';

import type { Studio } from '@shared/model';

@Component({
    imports: [ReactiveFormsModule, RouterLink],
    template: ` <a [routerLink]="['/owner/studios', studio().id]">К студии</a>
        <h1>Залы и тарифы</h1>
        <form
            [formGroup]="form()"
            (ngSubmit)="save()"
        >
            <div formArrayName="rooms">
                @for (row of form().controls.rooms.controls; track row; let i = $index) {
                    <fieldset [formGroupName]="i">
                        <legend>Зал {{ i + 1 }}</legend>
                        <label>Название <input formControlName="name" /></label>
                        <label
                            >Цена за час
                            <input
                                type="number"
                                formControlName="pricePerHour"
                        /></label>
                    </fieldset>
                }
            </div>
            <button [disabled]="saving()">Сохранить тарифы</button>
        </form>
        <p role="status">{{ status() }}</p>`,
})
export class RoomEditorComponent {
    readonly studio = input.required<Studio>();
    private readonly api = inject(StudiosApi);
    protected readonly status = signal('');
    protected readonly saving = signal(false);
    protected readonly form = computed(
        () =>
            new FormGroup({
                rooms: new FormArray(
                    (this.studio().rooms ?? []).map(
                        (room) =>
                            new FormGroup({
                                id: new FormControl(room.id),
                                name: new FormControl(room.name),
                                pricePerHour: new FormControl(room.pricePerHour),
                            }),
                    ),
                ),
            }),
    );
    protected save(): void {
        if (this.saving()) return;
        const studio = this.studio();
        const rooms = this.form()
            .getRawValue()
            .rooms.map((room) => ({
                id: room.id ?? '',
                name: room.name ?? '',
                pricePerHour: room.pricePerHour ?? 0,
            }));
        this.saving.set(true);
        this.status.set('');
        this.api
            .update({
                ...studio,
                rooms,
                pricePerHour: rooms.length
                    ? Math.min(...rooms.map((room) => room.pricePerHour))
                    : studio.pricePerHour,
            })
            .subscribe({
                next: () => {
                    this.saving.set(false);
                    this.status.set('Тарифы сохранены');
                },
                error: () => {
                    this.saving.set(false);
                    this.status.set('Не удалось сохранить тарифы');
                },
            });
    }
}
