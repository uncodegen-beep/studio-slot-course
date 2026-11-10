import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import type { Booking } from '@entities/booking/model/booking';
import { DEMO_BOOKINGS } from '@entities/booking/model/bookings.demo';

import { PluralPipe } from '@shared/lib/plural/plural.pipe';
import { STATUS_LABELS } from '@shared/model';
import { CardActionsDirective } from '@shared/ui/card/card-actions.directive';
import { CardComponent } from '@shared/ui/card/card.component';

@Component({
    selector: 'app-my-bookings',
    imports: [CardActionsDirective, CardComponent, CurrencyPipe, DatePipe, PluralPipe],
    templateUrl: './my-bookings.component.html',
    styleUrl: './my-bookings.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyBookingsComponent {
    protected bookings: Booking[] = DEMO_BOOKINGS;
    protected readonly labels = STATUS_LABELS;

    /** Новый массив и новый объект бронирования — исходные данные не мутируем */
    protected cancel(id: string): void {
        this.bookings = this.bookings.map((booking): Booking =>
            booking.id === id ? { ...booking, status: 'CANCELED' } : booking,
        );
    }
}
