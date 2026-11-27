// Подменяет environment.ts в сборке development (fileReplacements в angular.json)
export const environment = {
    production: false,
    apiBaseUrl: 'api',
    // Мок-API на MSW: Service Worker отвечает на запросы к /api данными из памяти
    mockApi: true,
    analyticsToConsole: true,
};
