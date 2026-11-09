import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { LOCALE_ID, type Provider } from '@angular/core';

/**
 * Русская локаль для date, currency, number: месяцы по-русски, пробел между разрядами.
 * Одна функция и для app.config, и для тестов — TestBed не читает app.config
 */
export function provideRuLocale(): Provider {
    registerLocaleData(localeRu);
    return { provide: LOCALE_ID, useValue: 'ru' };
}
