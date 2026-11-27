import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import { BookingPanelComponent } from '@features/book-slot/ui/booking-panel/booking-panel.component';

import { formatTitle } from '@shared/lib/title/app-title.strategy';
import type { Studio } from '@shared/model';

import { NearbyStudiosComponent } from './nearby-studios.component';

/**
 * Страница студии: /studios/:id. Данные загрузил studioResolver до показа страницы,
 * поэтому здесь нет загрузки и ошибки — только готовая студия во входе
 */
@Component({
    selector: 'app-studio-page',
    imports: [NearbyStudiosComponent, BookingPanelComponent, CurrencyPipe, DecimalPipe, RouterLink],
    templateUrl: './studio-page.component.html',
    styleUrl: './studio-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudioPageComponent {
    /** resolve: { studio } в маршруте → вход studio (withComponentInputBinding) */
    readonly studio = input.required<Studio>();

    private readonly title = inject(Title);

    constructor() {
        // У маршрута общий title «Студия»; имя известно только из данных — уточняем после показа
        effect(() => this.title.setTitle(formatTitle(this.studio().name)));
    }
}
