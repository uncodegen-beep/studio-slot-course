import { ChangeDetectionStrategy, Component } from '@angular/core';

import type { Booking } from '@entities/booking/model/booking';
import { DEMO_BOOKINGS } from '@entities/booking/model/bookings.demo';

import { STATUS_LABELS } from '@shared/model';
import { CardComponent } from '@shared/ui/card/card.component';

@Component({
    selector: 'app-my-bookings',
    imports: [CardComponent],
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
