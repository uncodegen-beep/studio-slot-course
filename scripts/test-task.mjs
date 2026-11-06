// Автотесты заданий модуля: npm run test:task -- module-00
// Запускает только тесты из tasks/<модуль>/, обычные тесты src/ не трогает.
import { spawnSync } from 'node:child_process';

const moduleName = process.argv[2];

if (!moduleName || !/^module-\d{2}$/.test(moduleName)) {
    console.error('Укажите модуль: npm run test:task -- module-00');
    process.exit(1);
}

const result = spawnSync(
    'npx',
    ['ng', 'test', '--watch=false', `--include=../tasks/${moduleName}/**/*.spec.ts`],
    { stdio: 'inherit', shell: process.platform === 'win32' },
);

process.exit(result.status ?? 1);
