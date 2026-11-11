import { type Signal, computed } from '@angular/core';

import type { StudioRoom } from '@shared/model';

/** Вечерний тариф: с 18:00 до 23:00 цена выше на 20 % */
const PEAK_FROM = 18;
const PEAK_TO = 23;
const PEAK_MULTIPLIER = 1.2;

export interface SlotPrice {
    readonly isPeak: Signal<boolean>;
    readonly base: Signal<number>;
    readonly total: Signal<number>;
}

/**
 * Фабрика из сигналов: переиспользуемая логика цены без сервиса.
 * Принимает сигналы, а не значения, — результат пересчитывается сам
 */
export function createSlotPrice(
    room: Signal<StudioRoom | null>,
    hours: Signal<number>,
    startHour: Signal<number>,
): SlotPrice {
    const isPeak = computed(() => startHour() >= PEAK_FROM && startHour() < PEAK_TO);
    const base = computed(() => (room()?.pricePerHour ?? 0) * hours());
    const total = computed(() => Math.round(base() * (isPeak() ? PEAK_MULTIPLIER : 1)));

    return { isPeak, base, total };
}
