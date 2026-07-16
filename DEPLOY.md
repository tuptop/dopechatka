# План деплоя сайта курса

Сайт — статика (HTML + CSS + SVG + шрифты), без бэкенда. Папка `site/` — это уже готовый корень сайта, собирать ничего не нужно.

## Перед выкладкой (блокеры)

1. **Кнопки «Оформить предзаказ»** (2 шт.) ведут в никуда (`href="#"`).
   Решить, куда: платёжная ссылка (ЮKassa / Prodamus / Robokassa), форма (Tally / Google Forms) или личка в Телеграме. Вписать ссылку в `site/index.html`.
2. **Ссылка «мне в Телеграм»** в «Вопросах» — тоже заглушка. Вписать `https://t.me/<юзернейм>`.
3. ~~Лицензии шрифтов~~ — решено: весь сайт на TT Norms, лицензия есть.
4. **Фавиконка и OG-превью** для соцсетей и мессенджеров (сделать og:image 1200×630 — например, «клякса» с ценой).

## Вариант А (рекомендую): свой VPS + nginx

Подходит, если уже есть сервер. Если нет — самый дешёвый VPS (Timeweb, Beget, reg.ru) за ~200–300 ₽/мес.

1. Направить домен на сервер: A-запись `@` и `www` → IP сервера.
2. На сервере:
   ```bash
   sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx
   sudo mkdir -p /var/www/dopechatka
   ```
3. Конфиг `/etc/nginx/sites-available/dopechatka`:
   ```nginx
   server {
     server_name example.ru www.example.ru;   # ← домен
     root /var/www/dopechatka;
     index index.html;
     gzip on;
     gzip_types text/css application/javascript image/svg+xml;
     location ~* \.(svg|ttf|otf|woff2?)$ { expires 30d; add_header Cache-Control "public"; }
   }
   ```
   ```bash
   sudo ln -s /etc/nginx/sites-available/dopechatka /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   sudo certbot --nginx -d example.ru -d www.example.ru   # HTTPS
   ```
4. Выкладка с мака (и каждое обновление) — одна команда:
   ```bash
   rsync -avz --delete "~/Yandex.Disk.localized/Совместная работа/Мой курс по допечатке/site/" user@server:/var/www/dopechatka/
   ```

## Вариант Б (без сервера вообще): статичный хостинг

- **GitHub Pages** — бесплатно: репозиторий, в Settings → Pages указать папку, свой домен подключается CNAME-записью.
- **Netlify / Vercel** — бесплатно, деплой перетаскиванием папки `site/` в браузер. Иногда медленные из РФ.
- **Beget / Timeweb «хостинг сайтов»** — залить содержимое `site/` по FTP/SFTP в `public_html`.

## После выкладки

- Подключить Яндекс.Метрику (вебвизор покажет, докуда долистывают и жмут ли на предзаказ).
- Проверить страницу в Телеграм-превью и ВК (og-теги).
- Конвертировать шрифты в woff2 (сейчас ttf/otf, woff2 в ~2 раза легче): `pip install fonttools brotli && fonttools ttLib.woff2 compress <файл>`.
- Прогнать Lighthouse в Chrome DevTools.

## Что сознательно отложено

- Мобильная вёрстка: сейчас страница пропорционально масштабируется под ширину экрана (JS в `index.html`). Для отдельной мобильной раскладки нужен мобильный макет.
- Аккордеон «Вопросы» — в макете это скетч-заглушка; когда появятся реальные вопросы, сверстаем рабочий аккордеон.
