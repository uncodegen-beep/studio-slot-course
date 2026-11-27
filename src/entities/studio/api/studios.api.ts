import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { type Observable, map, shareReplay, tap } from 'rxjs';

import { LOCAL_RETRY } from '@shared/api/interceptors/http.interceptors';
import type { Studio } from '@shared/model';

import { type StudioDto, toStudio, toStudioDto } from './studio.dto';

/**
 * Доступ к данным студий. Компоненты не знают адресов и HttpClient — только методы сервиса.
 * Запросы обслуживает мок-API на MSW (урок 70); с настоящим сервером код не изменится
 */
@Injectable({ providedIn: 'root' })
export class StudiosApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = 'api';
    /** Один горячий поток на студию: повторный переход на неё не идёт в сеть */
    private readonly cache = new Map<string, Observable<Studio>>();

    /** GET /api/studios/:id */
    getById(id: string): Observable<Studio> {
        const cached = this.cache.get(id);
        if (cached) {
            return cached;
        }
        const studio$ = this.http.get<StudioDto>(`${this.baseUrl}/studios/${id}`).pipe(
            map(toStudio),
            // HttpClient холодный: каждая подписка — новый запрос. shareReplay делает поток горячим:
            // один запрос на всех подписчиков, последний ответ — новым подписчикам.
            // refCount: false — кэш живёт, даже когда подписчиков не осталось.
            // Ошибку shareReplay не запоминает: следующая подписка снова пойдёт в сеть
            shareReplay({ bufferSize: 1, refCount: false }),
        );
        this.cache.set(id, studio$);
        return studio$;
    }

    /** GET /api/studios?q= — фильтрует сервер, клиенту приходят только совпадения */
    search(query: string): Observable<Studio[]> {
        return this.http
            .get<StudioDto[]>(`${this.baseUrl}/studios`, {
                context: new HttpContext().set(LOCAL_RETRY, true),
                params: { q: query },
            })
            .pipe(map((rows) => rows.map(toStudio)));
    }

    /** PUT /api/studios/:id — студия целиком; ответ — сохранённая версия */
    update(studio: Studio): Observable<Studio> {
        return (
            this.http
                .put<StudioDto>(`${this.baseUrl}/studios/${studio.id}`, toStudioDto(studio))
                // Данные изменились — кэш студии больше не верен
                .pipe(
                    map(toStudio),
                    tap(() => this.invalidate(studio.id)),
                )
        );
    }

    /** Данные студии изменились — следующий запрос пойдёт в сеть */
    invalidate(id: string): void {
        this.cache.delete(id);
    }
}
