import { Injectable } from '@angular/core';

/**
 * Правила цены в одном месте. Компоненты не создают сервис через new — просят его у инжектора,
 * поэтому в тесте или для промо-акции реализацию можно подменить провайдером
 */
@Injectable({ providedIn: 'root' })
export class PricingService {
    /** Вечерний тариф: с 18:00 до 23:00 цена выше на 20 % */
    protected readonly peakFrom = 18;
    protected readonly peakTo = 23;
    protected readonly peakMultiplier = 1.2;

    isPeak(startHour: number): boolean {
        return startHour >= this.peakFrom && startHour < this.peakTo;
    }

    quote(pricePerHour: number, hours: number, startHour: number): number {
        const base = pricePerHour * hours;
        return Math.round(base * (this.isPeak(startHour) ? this.peakMultiplier : 1));
    }
}
