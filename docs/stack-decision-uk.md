# Вибір технологічного стеку

## Підсумок

Набір автотестів реалізовано на TypeScript із Playwright. Це робить репозиторій цілісним, відповідає мові фронтенду та дає один тестовий раннер як для браузерного E2E, так і для HTTP API-покриття. Бекенд написаний на Python, тому unit- та integration-тести бекенду природно мають розміщуватися поруч із бекенд-кодом і використовувати pytest. Для цього тестового завдання реалізований обсяг автоматизації охоплює API та E2E-тестування, оскільки саме це є практичними результатами, яких вимагає завдання.

## Чому TypeScript

TypeScript — найкращий вибір для цього завдання, оскільки фронтенд застосунку вже написаний на TypeScript. QA automation suite, написаний тією ж мовою, що й фронтенд, знижує вартість підтримки для команди: frontend-інженери можуть читати та рев’юити тести, page objects можуть моделювати поведінку UI за допомогою знайомих типів, а builders тестових даних можуть виявляти помилки структури ще на етапі компіляції.

TypeScript також дає корисний рівень безпеки без зайвої складності. У цьому репозиторії типізовано тестові payload, API responses, environment config і fixtures. Це важливо в автоматизації, оскільки непомітні помилки в тестовому сетапі можуть призводити до хибних падінь або хибного відчуття надійності. Наприклад, payload контакту з помилково написаним полем має швидко виявлятися під час code review, type checking або schema validation, а не ховатися всередині слабо типізованого helper-коду.

Те, що бекенд написаний на Python, не означає, що сам automation suite теж має бути на Python. Системні API- та E2E-тести взаємодіють із розгорнутим застосунком через стабільні зовнішні контракти: HTTP endpoints і поведінку браузера. Для цих рівнів головні критерії вибору — maintainability, execution speed, reporting, CI support і відповідність команді, яка буде підтримувати тести. TypeScript відповідає цим критеріям, водночас дозволяючи Python-бекенду й надалі використовувати pytest для нижчих рівнів бекенд-тестування.

## Обрані інструменти

Як основний framework використовується Playwright Test. Він надає browser automation, API testing, fixtures, assertions, tracing, screenshots, retries, parallel execution і HTML reporting в одному toolchain. Використання Playwright і для API, і для E2E-тестів дозволяє уникнути зайвих витрат на змішування різних тестових раннерів у межах цього завдання, при цьому зберігаючи чітке розділення за папками та project-конфігураціями.

API-тести використовують Playwright `APIRequestContext`. Цього достатньо для перевірок authorization, CRUD, response status, response time і contract checks. Для schema validation використовується Zod, оскільки він дозволяє тримати response schemas поруч із тестовим кодом, дає зрозумілі повідомлення про помилки та генерує TypeScript types з тих самих визначень.

E2E-тести використовують browser automation Playwright разом із page objects для стабільних поверхонь UI. Page objects тут навмисно зроблені "тонкими": вони централізують locators і прості дії користувача, але не приховують assertions чи business intent.

HTML report — це вбудований звіт Playwright. У CI він завантажується як artifact разом із сирими test results, traces, screenshots і videos для невдалих E2E-запусків.

Для повноцінного product repository ширший тестовий стек виглядав би так:

- Frontend unit/integration: Vitest із Testing Library, оскільки це швидкий, TypeScript-native інструмент, який добре підходить до сучасного фронтенд-стеку.
- Backend unit/integration: pytest, оскільки це стандарт для Python із виразними fixtures, parametrization і можливостями для backend-focused integration tests.
- API та E2E: Playwright, оскільки він добре покриває контракти розгорнутого застосунку та браузерні користувацькі сценарії.

## Компроміси та альтернативи

Python разом із pytest добре узгоджується з бекендом, і pytest чудово підходить для API-тестів. Недолік для цього завдання в тому, що для E2E browser automation довелося б додавати Playwright Python або Selenium, а frontend-команда мала б меншу пряму мовну сумісність. Це створює розділену модель ownership ще до того, як проєкт матиме достатній обсяг тестів, щоб це виправдати.

Cypress є достойним варіантом для E2E у TypeScript-проєктах і має сильний developer experience. Однак Playwright було обрано тому, що його підтримка API testing, browser context isolation, tracing, parallel execution і cross-browser model є сильнішою для єдиної основи, яка охоплює і API, і E2E automation.

Postman або Newman були б простими для API-only перевірок, але вони додали б другу тестову модель і не допомогли б із браузерним покриттям. Завдання вимагає і API, і E2E automation, тому один framework — чистіше рішення.

Selenium досі широко використовується, але з ним потрібно окремо визначати runner, fixtures, reporting, waits і API testing stack. Playwright надає ці частини "з коробки" й заохочує сучасні підходи до locator patterns та isolation.

Головний компроміс від використання єдиного Playwright suite полягає в тому, що він не повинен замінювати справжні unit- і component-level тести. У цьому й полягає задум. Цей репозиторій реалізує API та E2E-обсяг, потрібний для завдання, і водночас документує, де саме в повній engineering test pyramid будуть доречні Vitest і pytest.
