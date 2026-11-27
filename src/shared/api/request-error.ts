import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, inject } from '@angular/core';

import { NotifierService } from '@shared/lib/notify/notifier.service';

export function requestErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
        if (error.status === 0) return 'Нет связи с сервером';
        if (error.status === 403) return 'Для этого действия недостаточно прав';
        if (error.status === 404) return 'Данные не найдены';
    }
    return 'Не удалось выполнить операцию. Попробуйте ещё раз.';
}

@Injectable()
export class AppErrorHandler extends ErrorHandler {
    private readonly notifier = inject(NotifierService);
    override handleError(error: unknown): void {
        super.handleError(error);
        this.notifier.notify(requestErrorMessage(error));
    }
}
