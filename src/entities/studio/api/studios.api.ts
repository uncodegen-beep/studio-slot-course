import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { type Observable, map, shareReplay } from 'rxjs';

import { DEFAULT_STUDIO_FILTERS, filterStudios } from '@entities/studio/model/studio-filters';

import { APP_CONFIG } from '@shared/config/app-config';
import type { Studio } from '@shared/model';

/**
 * Доступ к данным студий. Компоненты не знают адресов и HttpClient — только методы сервиса.
 * providedIn: 'root' — один экземпляр, создаётся при первом inject и не попадёт в бандл, если не нужен
 */
@Injectable({ providedIn: 'root' })
export class StudiosApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(APP_CONFIG).apiBaseUrl;
    /** Один горячий поток на студию: повторный переход на неё не идёт в сеть */
    private readonly cache = new Map<string, Observable<Studio>>();

    /** Пока API нет — JSON-заглушка из public/api */
    getById(id: string): Observable<Studio> {
        const cached = this.cache.get(id);
        if (cached) {
            return cached;
        }
        const studio$ = this.http.get<Studio>(`${this.baseUrl}/studios/${id}.json`).pipe(
            // HttpClient холодный: каждая подписка — новый запрос. shareReplay делает поток горячим:
            // один запрос на всех подписчиков, последний ответ — новым подписчикам.
            // refCount: false — кэш живёт, даже когда подписчиков не осталось.
            // Ошибку shareReplay не запоминает: следующая подписка снова пойдёт в сеть
            shareReplay({ bufferSize: 1, refCount: false }),
        );
        this.cache.set(id, studio$);
        return studio$;
    }

    /**
     * Поиск по названию и городу. Запрос уходит с ?q=, но статичный JSON его не понимает —
     * пока сервера нет, фильтруем сами. С настоящим API map уйдёт, а сигнатура останется
     */
    search(query: string): Observable<Studio[]> {
        return this.http
            .get<Studio[]>(`${this.baseUrl}/studios/index.json`, { params: { q: query } })
            .pipe(map((studios) => filterStudios(studios, query, DEFAULT_STUDIO_FILTERS)));
    }

    /** Данные студии изменились (урок 92: редактор зала) — следующий запрос пойдёт в сеть */
    invalidate(id: string): void {
        this.cache.delete(id);
    }
}
