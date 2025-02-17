# Cian Deal Analyzer N3

Cian Deal Analyzer N3 - это расширение для браузера Chrome, которое помогает анализировать предложения по аренде недвижимости на сайте Cian.ru. Расширение оценивает, является ли сделка выгодной, основываясь на доходе пользователя и ежемесячном платеже за аренду.

## Структура проекта

- `.cursorrules`: Файл конфигурации для настройки курсора в редакторе кода.
- `.gitignore`: Список файлов и директорий, которые Git должен игнорировать.
- `background.js`: Фоновый скрипт расширения, который слушает обновления вкладок и инициирует анализ при загрузке страницы Cian.
- `content.js`: Контентный скрипт, который внедряется на страницы Cian.ru для извлечения данных и отображения результатов анализа.
- `instruction.md`: Инструкции по использованию или разработке расширения.
- `manifest.json`: Файл манифеста расширения, описывающий его конфигурацию и разрешения.
- `popup.html`: HTML-файл для всплывающего окна расширения.
- `popup.js`: JavaScript-файл для управления логикой всплывающего окна.

## Функциональное назначение файлов

- `background.js`: Отслеживает загрузку страниц Cian и запускает анализ, если установлен доход пользователя.
- `content.js`: Извлекает данные о стоимости аренды, вычисляет выгодность сделки и отображает результат на странице Cian.
- `popup.html`: Предоставляет интерфейс для ввода дохода пользователя и отображения результатов анализа.
- `popup.js`: Обрабатывает взаимодействие пользователя с всплывающим окном, сохраняет введенный доход и инициирует анализ.
- `manifest.json`: Определяет метаданные расширения, разрешения и скрипты, которые должны быть загружены.

## Использование

1. Установите расширение в браузер Chrome.
2. Откройте всплывающее окно расширения и введите свой месячный доход.
3. Перейдите на страницу объявления об аренде на Cian.ru.
4. Расширение автоматически проанализирует сделку и отобразит результат на странице.

## Разработка

Для внесения изменений в расширение, отредактируйте соответствующие файлы:
- Измените `content.js` для корректировки логики анализа или отображения результатов на странице Cian.
- Обновите `popup.html` и `popup.js` для изменения интерфейса всплывающего окна.
- Отредактируйте `manifest.json` при необходимости изменения конфигурации расширения.

После внесения изменений не забудьте обновить расширение в браузере для тестирования новой функциональности.
