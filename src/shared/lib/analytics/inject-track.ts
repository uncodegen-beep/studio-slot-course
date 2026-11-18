import { assertInInjectionContext, inject } from '@angular/core';

import { AnalyticsService } from './analytics.service';

export type TrackFn = (params?: Record<string, unknown>) => void;

/**
 * inject-функция: получает зависимость сразу, а возвращает обычную функцию,
 * которую можно звать где угодно — в обработчике клика, в subscribe, в setTimeout.
 * Сама вызывается только в контексте внедрения: поле класса, конструктор, фабрика провайдера
 */
export function injectTrack(name: string): TrackFn {
    // Понятная ошибка с именем функции вместо общего NG0203 из глубины inject()
    assertInInjectionContext(injectTrack);
    const analytics = inject(AnalyticsService);

    return (params = {}) => analytics.track(name, params);
}
