import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import type { Observable } from 'rxjs';

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

    /** Пока API нет — JSON-заглушка из public/api */
    getById(id: string): Observable<Studio> {
        return this.http.get<Studio>(`${this.baseUrl}/studios/${id}.json`);
    }
}
