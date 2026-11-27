import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app';
import { appConfig } from './app/app.config';
import { environment } from './environments/environment';

/**
 * Мок-API запускается до приложения: первый же запрос должен попасть в Service Worker.
 * Динамический import — код MSW в отдельном чанке и не грузится, когда мок выключен
 */
async function enableMocking(): Promise<void> {
    if (!environment.mockApi) {
        return;
    }
    const { worker } = await import('./app/mocks/browser');
    await worker.start({
        // Относительный путь — от base href: на GitHub Pages сайт живёт в подпапке
        serviceWorker: { url: 'mockServiceWorker.js' },
        // Запросы не к API (шрифты, картинки) идут в сеть как обычно
        onUnhandledRequest: 'bypass',
        quiet: environment.production,
    });
}

enableMocking()
    .then(() => bootstrapApplication(AppComponent, appConfig))
    .catch((error: unknown) => console.error(error));
