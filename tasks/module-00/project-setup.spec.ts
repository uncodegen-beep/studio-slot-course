// Задание модуля 00: каркас репозитория готов к работе.
// Тест проверяет результат, а не то, как вы к нему пришли: настройки могут
// отличаться от авторских, если требования ниже выполнены.
import pkg from '../../package.json';
import tsconfig from '../../tsconfig.json';

describe('Модуль 00 · каркас проекта', () => {
    it('Node.js 24 и npm зафиксированы в package.json', () => {
        expect(pkg.engines.node).toContain('24');
        expect(pkg.packageManager).toMatch(/^npm@\d+/);
    });

    it('есть скрипты разработки, сборки, тестов, линтера и форматирования', () => {
        const scripts = Object.keys(pkg.scripts);

        for (const script of [
            'start:dev',
            'build:prod',
            'test:run',
            'test:ci',
            'lint',
            'format:check',
            'prepare',
        ]) {
            expect(scripts, `нет скрипта ${script}`).toContain(script);
        }
    });

    it('TypeScript в строгом режиме', () => {
        const options = tsconfig.compilerOptions;

        expect(options.strict).toBe(true);
        expect(options.noUncheckedIndexedAccess).toBe(true);
        expect(options.noUnusedLocals).toBe(true);
        expect(tsconfig.angularCompilerOptions.strictTemplates).toBe(true);
    });

    it('алиасы путей для всех слоёв', () => {
        const aliases = Object.keys(tsconfig.compilerOptions.paths);

        for (const layer of ['app', 'pages', 'widgets', 'features', 'entities', 'shared']) {
            expect(aliases).toContain(`@${layer}/*`);
        }
    });
});
