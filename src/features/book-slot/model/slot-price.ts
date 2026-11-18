import { type Signal, assertInInjectionContext, computed, inject } from '@angular/core';

import type { StudioRoom } from '@shared/model';

import { PricingService } from './pricing.service';

export interface SlotPrice {
    readonly isPeak: Signal<boolean>;
    readonly total: Signal<number>;
}

/**
 *  * inject() требует контекст внедрения: вызывайте в поле класса или конструкторе.
 * Вызов из обработчика клика упадёт с понятной ошибкой — её даёт assertInInjectionContext
 */
export function createSlotPrice(
    room: Signal<StudioRoom | null>,
    hours: Signal<number>,
    startHour: Signal<number>,
): SlotPrice {
    assertInInjectionContext(createSlotPrice);
    const pricing = inject(PricingService);

    const isPeak = computed(() => pricing.isPeak(startHour()));
    const total = computed(() => pricing.quote(room()?.pricePerHour ?? 0, hours(), startHour()));

    return { isPeak, total };
}
