# Лендинг курса по допечатке

Статический сайт (HTML + CSS + SVG + шрифты). **Сборки и бэкенда нет.** Папка `site/` —
готовый корень, который отдаётся на GitHub Pages.

- **Живой сайт:** https://tuptop.github.io/dopechatka/
- **Репозиторий:** https://github.com/tuptop/dopechatka
- **Деплой:** любой пуш в `main` → GitHub Actions выкладывает `site/`. Подробности — [DEPLOY.md](DEPLOY.md).

## Быстрый старт (посмотреть локально)

```bash
git clone https://github.com/tuptop/dopechatka.git
cd dopechatka
python3 -m http.server 8742 --directory site
# открыть http://localhost:8742
```

Подойдёт любой статический сервер — ничего собирать не нужно, правишь файлы и обновляешь страницу.

## Структура

| Путь | Что это |
|------|---------|
| `site/index.html` | Весь лендинг — одна страница. В конце `<script>` — вся интерактивность. |
| `site/style.css` | Все стили. |
| `site/assets/` | Графика: SVG, картинки, видео, og-превью. |
| `site/fonts/` | Шрифт TT Norms (otf). |
| `site/urok/` | Бесплатный урок: `index.html` + `images/` (собран из Notion-экспорта). |
| `site/success.html`, `site/fail.html` | Страницы после оплаты (Продамус). |
| `.github/workflows/pages.yml` | Авто-деплой `site/` на GitHub Pages. |

## Правила, чтобы ничего не сломать

1. **Фиксированная ширина 1440px, без адаптива.** Страница — это секции `section.canvas`
   с заданной высотой (`style="height:NNNpx"`); внутри элементы позиционируются абсолютно
   (класс `.abs`) или потоком в контейнерах. **Если контент в секции стал выше — подними
   `height` этой секции**, иначе он наедет на следующую. Мобильной раскладки нет намеренно —
   страница просто масштабируется под ширину экрана (см. JS в `index.html`).
2. **Кэш-бастинг.** После правок в `style.css` подними версию в `index.html`:
   `href="style.css?v=NN"` → `NN+1`. Иначе у вернувшихся посетителей останется старый CSS.
3. **Шрифт — только TT Norms** (лицензия есть), подключён из `site/fonts/`.
4. **Кириллица в путях/именах файлов** (например, в `urok/images/`) — рабочая, GitHub Pages
   отдаёт её корректно. Имена файлов должны точно совпадать с `src` в HTML (регистр, «ё»).
5. **Оплата (Продамус)** настраивается в объекте `PAY` в начале `<script>` в `index.html` —
   см. [DEPLOY.md](DEPLOY.md).

## Деплой

```bash
git add -A && git commit -m "Что изменил" && git push
```

GitHub Actions (~1 мин) выложит на https://tuptop.github.io/dopechatka/.
У посетителей кэш обновляется до ~10 минут (жёсткий сброс — Cmd/Ctrl+Shift+R).

## Доступ

Чтобы деплоить, нужен доступ на запись в репозиторий `tuptop/dopechatka`
(GitHub → Settings → Collaborators). Деплой = пуш в `main`, поэтому push-доступа достаточно.
