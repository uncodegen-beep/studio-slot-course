import { CurrencyPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    linkedSignal,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { EMPTY, Subject, catchError, exhaustMap, finalize } from 'rxjs';

import { BOOKING_CONFIG, injectStartHours } from '@features/book-slot/model/booking-config';
import { BookingDraftStore } from '@features/book-slot/model/booking-draft.store';
import { createSlotPrice } from '@features/book-slot/model/slot-price';

import { BookingsApi, type NewBooking } from '@entities/booking/api/bookings.api';
import { SessionStore } from '@entities/session/model/session.store';

import { requestErrorMessage } from '@shared/api/request-error';
import { NotifierService } from '@shared/lib/notify/notifier.service';
import { PluralPipe } from '@shared/lib/plural/plural.pipe';
import type { Studio, StudioRoom } from '@shared/model';
import { DurationPickerComponent } from '@shared/ui/duration-picker/duration-picker.component';

let nextId = 0;

const pad = (value: number): string => String(value).padStart(2, '0');

/** Завтра в выбранный час: 2026-11-20T12:00. Выбор даты появится в форме бронирования (модуль 07) */
export function tomorrowAt(hour: number, now = new Date()): string {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    return `${day.getFullYear()}-${pad(day.getMonth() + 1)}-${pad(day.getDate())}T${pad(hour)}:00`;
}

/**
 * Панель бронирования: зал, длительность, начало и цена.
 * providers: [BookingDraftStore] — у каждой панели свой черновик, дети панели получают тот же
 */
@Component({
    selector: 'app-booking-panel',
    imports: [CurrencyPipe, DurationPickerComponent, PluralPipe],
    providers: [BookingDraftStore],
    templateUrl: './booking-panel.component.html',
    styleUrl: './booking-panel.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingPanelComponent {
    readonly studio = input.required<Studio>();

    protected readonly draft = inject(BookingDraftStore);
    /** Имя группы радиокнопок — своё у каждой панели, иначе две панели делили бы выбор */
    protected readonly roomGroup = `booking-room-${nextId++}`;
    /** Часы начала и варианты длительности — из BOOKING_CONFIG, а не зашиты в компоненте */
    protected readonly startHours = injectStartHours();
    protected readonly hourOptions = Array.from(
        { length: inject(BOOKING_CONFIG).maxHours },
        (_, index) => index + 1,
    );

    /** Выбранный зал: тот же, если он есть в новом списке, иначе первый (урок 28) */
    protected readonly selectedRoom = linkedSignal<readonly StudioRoom[], StudioRoom | null>({
        source: () => this.studio().rooms ?? [],
        computation: (rooms, previous) =>
            rooms.find((room) => room.id === previous?.value?.id) ?? rooms[0] ?? null,
    });

    protected readonly price = createSlotPrice(
        this.selectedRoom,
        this.draft.hours,
        this.draft.startHour,
    );

    protected readonly session = inject(SessionStore);
    private readonly bookings = inject(BookingsApi);
    private readonly notifier = inject(NotifierService);
    /** Клики «Отправить заявку» */
    private readonly submits = new Subject<NewBooking>();
    protected readonly submitting = signal(false);

    constructor() {
        this.submits
            .pipe(
                // exhaustMap: пока заявка отправляется, новые клики игнорируются — двойной клик
                // не создаст две брони. switchMap отменил бы первую, mergeMap отправил бы обе
                exhaustMap((draft) => {
                    this.submitting.set(true);
                    return this.bookings.create(draft).pipe(
                        catchError((error: unknown) => {
                            this.notifier.notify(requestErrorMessage(error));
                            return EMPTY;
                        }),
                        finalize(() => this.submitting.set(false)),
                    );
                }),
                takeUntilDestroyed(),
            )
            .subscribe((booking) => {
                this.notifier.notify(`Заявка в ${booking.studioName} отправлена`);
            });
    }

    protected submit(room: StudioRoom): void {
        this.submits.next({
            studioName: this.studio().name,
            startsAt: tomorrowAt(this.draft.startHour()),
            hours: this.draft.hours(),
            pricePerHour: room.pricePerHour,
        });
    }
}
