import { type Signal, computed, inject } from '@angular/core';

import type { StudioRoom } from '@shared/model';

import { PricingService } from './pricing.service';

export interface SlotPrice {
    readonly isPeak: Signal<boolean>;
    readonly total: Signal<number>;
}

/**
 * Фабрика из сигналов. Правила цены больше не зашиты внутри — их даёт PricingService.
 * inject() требует контекст внедрения: вызывать в поле класса или конструкторе
 */
export function createSlotPrice(
    room: Signal<StudioRoom | null>,
    hours: Signal<number>,
    startHour: Signal<number>,
): SlotPrice {
    const pricing = inject(PricingService);

    const isPeak = computed(() => pricing.isPeak(startHour()));
    const total = computed(() => pricing.quote(room()?.pricePerHour ?? 0, hours(), startHour()));

    return { isPeak, total };
}
