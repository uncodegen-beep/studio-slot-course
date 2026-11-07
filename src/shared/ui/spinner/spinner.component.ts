import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-spinner',
    template: `<span class="visually-hidden">Загрузка...</span>`,
    styleUrl: './spinner.component.scss',
    host: { role: 'status' },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {}
