import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MyBookingsComponent } from '@widgets/my-bookings/ui/my-bookings.component';

/** Страница собирает виджеты; сама разметки почти не содержит */
@Component({
    selector: 'app-bookings-page',
    imports: [MyBookingsComponent],
    template: `
        <h1>Мои бронирования</h1>
        <app-my-bookings />
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingsPageComponent {}
