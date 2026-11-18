import { DOCUMENT } from '@angular/common';
import {
    type EnvironmentProviders,
    type Provider,
    inject,
    makeEnvironmentProviders,
} from '@angular/core';

import { PricingService } from './pricing.service';
import { PromoPricingService } from './promo-pricing.service';

export interface PricingFeature {
    readonly kind: 'promo' | 'promo-from-query';
    readonly providers: readonly Provider[];
}

/** Промо всегда: вечерний тариф отключён (useClass, урок 37) */
export function withPromo(): PricingFeature {
    return {
        kind: 'promo',
        providers: [{ provide: PricingService, useClass: PromoPricingService }],
    };
}

/** Промо по параметру в адресе: ?promo. Реализация выбирается при создании (useFactory) */
export function withPromoFromQuery(param = 'promo'): PricingFeature {
    return {
        kind: 'promo-from-query',
        providers: [
            {
                provide: PricingService,
                useFactory: () =>
                    new URLSearchParams(inject(DOCUMENT).location.search).has(param)
                        ? new PromoPricingService()
                        : new PricingService(),
            },
        ],
    };
}

/**
 * Настройка цен одной функцией. Без опций — обычный тариф из PricingService (providedIn: 'root').
 * app.config.ts больше не знает, какие классы и токены стоят за промо
 */
export function providePricing(...features: readonly PricingFeature[]): EnvironmentProviders {
    return makeEnvironmentProviders(features.flatMap((feature) => feature.providers));
}
