import { ChangeDetectionStrategy, Component } from '@angular/core';

import type { Booking } from '@entities/booking/model/booking';
import { DEMO_BOOKINGS } from '@entities/booking/model/bookings.demo';

import { STATUS_LABELS } from '@shared/model/booking-status';

@Component({
    selector: 'app-my-bookings',
    templateUrl: './my-bookings.component.html',
    styleUrl: './my-bookings.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyBookingsComponent {
    protected readonly bookings: Booking[] = DEMO_BOOKINGS;
    protected readonly labels = STATUS_LABELS;
}
