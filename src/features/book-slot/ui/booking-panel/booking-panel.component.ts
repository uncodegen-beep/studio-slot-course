import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, linkedSignal } from '@angular/core';

import { BookingDraftStore } from '@features/book-slot/model/booking-draft.store';
import { createSlotPrice } from '@features/book-slot/model/slot-price';

import { PluralPipe } from '@shared/lib/plural/plural.pipe';
import type { Studio, StudioRoom } from '@shared/model';
import { DurationPickerComponent } from '@shared/ui/duration-picker/duration-picker.component';

let nextId = 0;

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
    protected readonly startHours = [10, 12, 14, 16, 18, 20] as const;

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
}
