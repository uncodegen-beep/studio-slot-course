import { Injectable } from '@angular/core';

import { PricingService } from './pricing.service';

/** Промо: вечерний тариф отключён. Подставляется вместо PricingService провайдером useClass */
@Injectable()
export class PromoPricingService extends PricingService {
    override isPeak(): boolean {
        return false;
    }
}
