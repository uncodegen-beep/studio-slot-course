// Production-сборка. Всё, что здесь, попадает в бандл и видно любому пользователю — никаких секретов
export const environment = {
    production: true,
    apiBaseUrl: 'api',
    // Своего сервера у StudioSlot нет: и в проде запросы обслуживает MSW (сайт — статика на GitHub Pages)
    mockApi: true,
    analyticsToConsole: false,
};
