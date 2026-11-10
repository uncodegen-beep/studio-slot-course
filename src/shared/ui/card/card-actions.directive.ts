import { Directive } from '@angular/core';

/**
 * Маркер слота действий: <button cardActions>. Логики нет — по директиве app-card
 * через contentChild узнаёт, передали ли ей кнопки
 */
// Имя атрибута совпадает с селектором слота из урока 17 — без префикса app осознанно
// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[cardActions]' })
export class CardActionsDirective {}
