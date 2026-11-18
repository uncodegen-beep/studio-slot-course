import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MyBookingsComponent } from '@widgets/my-bookings/ui/my-bookings.component';

/** Страница собирает виджеты; сама разметки почти не содержит */
@Component({
    selector: 'app-bookings-page',
    imports: [MyBookingsComponent, RouterLink],
    template: `
        <h1>Мои бронирования</h1>
        <app-my-bookings />
        <!-- queryParams — часть адреса: /studios?onlyOpen=true. Читать их научимся в уроке 46 -->
        <a
            routerLink="/studios"
            [queryParams]="{ onlyOpen: true }"
        >
            Найти свободную студию
        </a>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingsPageComponent {}
