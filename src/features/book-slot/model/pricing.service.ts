import { Injectable, inject } from '@angular/core';

import { APP_CONFIG } from '@shared/config/app-config';

/**
 * Правила цены в одном месте. Компоненты не создают сервис через new — просят его у инжектора,
 * поэтому в тесте или для промо-акции реализацию можно подменить провайдером
 * Числа тарифа — из APP_CONFIG: меняются конфигом, а не правкой кода
 */
@Injectable({ providedIn: 'root' })
export class PricingService {
    private readonly config = inject(APP_CONFIG);

    isPeak(startHour: number): boolean {
        return startHour >= this.config.peakFrom && startHour < this.config.peakTo;
    }

    quote(pricePerHour: number, hours: number, startHour: number): number {
        const base = pricePerHour * hours;
        return Math.round(base * (this.isPeak(startHour) ? this.config.peakMultiplier : 1));
    }
}
