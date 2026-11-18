import { EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AnalyticsService } from './analytics.service';
import { injectTrack } from './inject-track';

describe('injectTrack', () => {
    it('вне контекста внедрения — ошибка с именем функции', () => {
        expect(() => injectTrack('click')).toThrow(/injectTrack\(\).*injection context/);
    });

    it('runInInjectionContext даёт контекст инжектора', () => {
        const injector = TestBed.inject(EnvironmentInjector);

        const track = runInInjectionContext(injector, () => injectTrack('favorite_toggle'));
        // Возвращённая функция контекста уже не требует — как вызов из обработчика клика
        track({ id: 'nevsky-beat' });

        expect(TestBed.inject(AnalyticsService).events()).toEqual([
            { name: 'favorite_toggle', params: { id: 'nevsky-beat' } },
        ]);
    });
});
