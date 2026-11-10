import { Injectable, effect, signal } from '@angular/core';

const STORAGE_KEY = 'studioslot.favorites';

/** Сохранённое избранное; хранилище недоступно или данные битые — начинаем с пустого */
function readSaved(): ReadonlySet<string> {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const ids: unknown = raw ? JSON.parse(raw) : [];
        return new Set(Array.isArray(ids) ? ids.filter((id) => typeof id === 'string') : []);
    } catch {
        return new Set();
    }
}

/**
 * Избранные студии. Один экземпляр на приложение (root): шапка и каталог видят одно состояние.
 * Меняет состояние только сам стор, наружу — сигнал только для чтения
 */
@Injectable({ providedIn: 'root' })
export class FavoritesStore {
    private readonly ids = signal<ReadonlySet<string>>(readSaved());

    /** У asReadonly() нет set и update — компонент не изменит состояние в обход toggle() */
    readonly favorites = this.ids.asReadonly();

    constructor() {
        // effect — запись во внешний мир: перезапускается, когда меняется прочитанный в нём ids()
        effect(() => {
            const ids = [...this.ids()];
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
            } catch {
                // приватный режим или запрет хранилища — избранное просто не сохранится
            }
        });
    }

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
