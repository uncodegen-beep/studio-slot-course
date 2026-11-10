import { Injectable, signal } from '@angular/core';

/**
 * Избранные студии. Один экземпляр на приложение (root): шапка и каталог видят одно состояние.
 * Меняет состояние только сам стор, наружу — сигнал только для чтения
 */
@Injectable({ providedIn: 'root' })
export class FavoritesStore {
    private readonly ids = signal<ReadonlySet<string>>(new Set());

    /** У asReadonly() нет set и update — компонент не изменит состояние в обход toggle() */
    readonly favorites = this.ids.asReadonly();

    toggle(id: string): void {
        // Новый Set: сигнал сравнивает по ссылке (Object.is), мутацию он бы не заметил
        this.ids.update((current) => {
            const next = new Set(current);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }
}
