# ahj3-2

# Task Tracker with Pinned Tasks

[![Deploy to GitHub Pages](https://github.com/ksanr/ahj3-2/actions/workflows/deploy.yml/badge.svg)](https://github.com/ksanr/ahj3-2/actions/workflows/deploy.yml)

Трекер задач с возможностью закрепления (pin) и фильтрацией.

## Демонстрация работы

[GitHub Pages](https://ksanr.github.io/ahj3-2/)

## Функциональность

- ✅ Добавление задач по Enter (с валидацией)
- ✅ Закрепление/открепление задач
- ✅ Фильтрация задач в реальном времени (по началу строки, без учёта регистра)
- ✅ Единый массив задач в памяти
- ✅ Автоматический деплой на GitHub Pages через CI
- ✅ Модульная архитектура (Webpack)
- ✅ Unit-тесты (Jest, ~80% покрытие)

## Установка и запуск

```bash
yarn install      # установка зависимостей
yarn start        # запуск dev сервера
yarn build        # сборка проекта
yarn test         # запуск тестов
yarn coverage     # проверка покрытия
yarn lint         # проверка кода
