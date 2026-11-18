import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** 404: адрес в строке браузера остаётся тем, что ввёл пользователь, — видно, где ошибка */
@Component({
    selector: 'app-not-found-page',
    imports: [RouterLink],
    template: `
        <h1>Страница не найдена</h1>
        <p>Возможно, ссылка устарела или в адресе опечатка.</p>
        <p>
            <a routerLink="/">На главную</a> ·
            <a routerLink="/studios">Все студии</a>
        </p>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPageComponent {}
