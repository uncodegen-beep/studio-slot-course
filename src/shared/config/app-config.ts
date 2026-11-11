import { InjectionToken } from '@angular/core';

import { environment } from '../../environments/environment';

/** Настройки приложения. Интерфейс исчезает при компиляции — ключом DI служит токен ниже */
export interface AppConfig {
    /** Путь к API без «/» в начале — ради base href на GitHub Pages */
    readonly apiBaseUrl: string;
    /** Вечерний тариф: с какого и до какого часа, и во сколько раз дороже */
    readonly peakFrom: number;
    readonly peakTo: number;
    readonly peakMultiplier: number;
}

/**
 * Токен с factory: значение по умолчанию есть всегда, регистрировать не нужно.
 * Переопределить — { provide: APP_CONFIG, useValue: {...} } в providers или в тесте
 */
export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG', {
    providedIn: 'root',
    factory: () => ({
        apiBaseUrl: environment.apiBaseUrl,
        peakFrom: 18,
        peakTo: 23,
        peakMultiplier: 1.2,
    }),
});
