import { Pipe, type PipeTransform } from '@angular/core';

/** Формы слова для 1, 2 и 5: ['час', 'часа', 'часов'] */
export type PluralForms = readonly [one: string, few: string, many: string];

/** {{ hours | plural: ['час', 'часа', 'часов'] }} → «5 часов» */
@Pipe({ name: 'plural' })
export class PluralPipe implements PipeTransform {
    // Правила склонения из браузера: 1, 21, 101 — one; 2–4, 22–24 — few; остальное — many
    private readonly rules = new Intl.PluralRules('ru-RU');

    transform(count: number, [one, few, many]: PluralForms): string {
        const form = this.rules.select(count);
        const word = form === 'one' ? one : form === 'few' ? few : many;
        return `${count} ${word}`;
    }
}
