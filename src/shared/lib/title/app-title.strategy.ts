import { Injectable, type Provider, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { type RouterStateSnapshot, TitleStrategy } from '@angular/router';

export const APP_NAME = 'StudioSlot';
const DEFAULT_TITLE = `${APP_NAME} — студии по часам`;

/** «Студии» → «Студии — StudioSlot». У маршрута без title — заголовок по умолчанию */
export function formatTitle(page: string | undefined): string {
    return page ? `${page} — ${APP_NAME}` : DEFAULT_TITLE;
}

/**
 * Своя стратегия заголовков: в маршрутах пишем только название страницы,
 * а формат «страница — сервис» задаётся в одном месте
 */
@Injectable({ providedIn: 'root' })
export class AppTitleStrategy extends TitleStrategy {
    private readonly title = inject(Title);

    override updateTitle(snapshot: RouterStateSnapshot): void {
        this.title.setTitle(formatTitle(this.buildTitle(snapshot)));
    }
}

export function provideAppTitleStrategy(): Provider {
    return { provide: TitleStrategy, useExisting: AppTitleStrategy };
}
