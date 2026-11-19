import { Injectable, effect, inject, signal } from '@angular/core';

import { injectTrack } from '@shared/lib/analytics/inject-track';
import { NotifierService } from '@shared/lib/notify/notifier.service';

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

    /** Поле класса — контекст внедрения есть; сама trackToggle вызывается потом, из toggle() */
    private readonly trackToggle = injectTrack('favorite_toggle');

    private readonly notifier = inject(NotifierService);

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

        const added = this.ids().has(id);
        this.trackToggle({ id, added });
        // Событие, а не состояние: сообщили — и забыли. Кто покажет, стор не знает
        this.notifier.notify(added ? 'Добавлено в избранное' : 'Убрано из избранного');
    }
}
