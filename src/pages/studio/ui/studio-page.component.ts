import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BookingPanelComponent } from '@features/book-slot/ui/booking-panel/booking-panel.component';

import type { Studio } from '@shared/model';

/**
 * Страница студии: /studios/:id. Данные загрузил studioResolver до показа страницы,
 * поэтому здесь нет загрузки и ошибки — только готовая студия во входе
 */
@Component({
    selector: 'app-studio-page',
    imports: [BookingPanelComponent, CurrencyPipe, DecimalPipe, RouterLink],
    templateUrl: './studio-page.component.html',
    styleUrl: './studio-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudioPageComponent {
    /** resolve: { studio } в маршруте → вход studio (withComponentInputBinding) */
    readonly studio = input.required<Studio>();
}
