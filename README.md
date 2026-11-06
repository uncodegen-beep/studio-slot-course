StudioSlot

[![CI](https://github.com/uncodegen-beep/studio-slot-course/actions/workflows/ci.yml/badge.svg)](https://github.com/uncodegen-beep/studio-slot-course/actions/workflows/ci.yml)

Учебный проект курса [«Современный Angular»](https://ngalg.dev): сервис бронирования репетиционных
студий и студий звукозаписи на Angular 22.

**Сайт:** https://uncodegen-beep.github.io/studio-slot-course/

## Код уроков

Каждый урок — тег `lesson-NNN`:

```bash
git tag --list 'lesson-*'
git checkout lesson-008                 # код на конец урока 8
git diff lesson-007 lesson-008          # что изменилось за урок
```

## Запуск

```bash
nvm use                 # Node.js 24 из .nvmrc
npm ci
npm run start:dev       # http://localhost:4200
```

| Команда                          | Что делает                           |
| -------------------------------- | ------------------------------------ |
| `npm run build:prod`             | продакшен-сборка в `dist/studioslot` |
| `npm run typecheck`              | проверка типов приложения и тестов   |
| `npm run lint`                   | ESLint                               |
| `npm run format:check`           | проверка форматирования Prettier     |
| `npm run test:run`               | unit-тесты                           |
| `npm run test:task -- module-00` | автотесты задания модуля             |
