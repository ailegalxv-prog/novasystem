"""NovaSystem — перехідник заявок із сайту в Telegram-групу.

Приймає POST (FormData) від форми на головній і від квізу, надсилає
повідомлення через бота. Токен і ID групи — у змінних середовища
(токен підтягується з Secret Manager), у коді сайту їх немає.
Формат повідомлень повторює попередні script.js та ns-quiz/send.php.
"""
import html
import json
import os
import re
import time
import urllib.parse
import urllib.request
from collections import defaultdict, deque
from datetime import datetime
from zoneinfo import ZoneInfo

from flask import Flask, jsonify, request

app = Flask(__name__)

TG_TOKEN = os.environ.get("TG_TOKEN", "")
TG_CHAT_ID = os.environ.get("TG_CHAT_ID", "")
ALLOWED_ORIGINS = {o.strip() for o in os.environ.get("ALLOWED_ORIGINS", "").split(",") if o.strip()}
RATE_LIMIT, RATE_WINDOW = 5, 600  # як у config.php: 5 заявок з IP за 10 хв
KYIV = ZoneInfo("Europe/Kyiv")
UTM_KEYS = ("utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term")

_hits = defaultdict(deque)


def field(key, max_len):
    value = request.form.get(key, "")
    value = re.sub(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]", "", value).strip()
    return value[:max_len]


def rate_limited(ip):
    now = time.time()
    q = _hits[ip]
    while q and now - q[0] > RATE_WINDOW:
        q.popleft()
    if len(q) >= RATE_LIMIT:
        return True
    q.append(now)
    return False


def cors(resp):
    origin = request.headers.get("Origin", "")
    if origin in ALLOWED_ORIGINS:
        resp.headers["Access-Control-Allow-Origin"] = origin
        resp.headers["Vary"] = "Origin"
    return resp


def reply(code, data):
    return cors(jsonify(data)), code


def send_telegram(text):
    payload = urllib.parse.urlencode({
        "chat_id": TG_CHAT_ID,
        "text": text,
        "parse_mode": "HTML",
        "disable_web_page_preview": "true",
    }).encode()
    url = f"https://api.telegram.org/bot{TG_TOKEN}/sendMessage"
    with urllib.request.urlopen(url, data=payload, timeout=10) as r:
        return json.loads(r.read()).get("ok", False)


def site_message(name, phone, source, now):
    # Формат форми з головної (був у script.js)
    return (
        "🔔 <b>Нова заявка з сайту</b>\n\n"
        f"👤 Ім'я: <b>{html.escape(name)}</b>\n"
        f"📞 Телефон: <b>{html.escape(phone)}</b>\n"
        f"📍 Джерело: {html.escape(source)}\n"
        f"🕒 {now}"
    )


def quiz_message(quiz, name, phone, now):
    # Формат квізу (був у ns-quiz/send.php)
    h = html.escape
    rows = [("Ім’я", name), ("Телефон", phone)]
    for key, label in (("channel", "Спосіб зв’язку"), ("discount", "Знижка за квіз"),
                       ("call_time", "Зручний час"), ("comment", "Коментар")):
        val = field(key, 1000 if key == "comment" else 40)
        if val:
            rows.append((label, val))
    msg = f"🔧 <b>Нова заявка — {h(quiz)}</b>\n\n"
    msg += "".join(f"<b>{h(k)}:</b> {h(v)}\n" for k, v in rows)

    answers = []
    try:
        raw = json.loads(request.form.get("answers", "") or "null")
    except ValueError:
        raw = None
    if isinstance(raw, list):
        for pair in raw[:20]:
            if isinstance(pair, list) and len(pair) == 2:
                q, a = str(pair[0]).strip()[:300], str(pair[1]).strip()[:500]
                if q and a:
                    answers.append((q, a))
    if answers:
        msg += "\n<b>Відповіді:</b>\n"
        msg += "".join(f"• {h(q)} — <i>{h(a)}</i>\n" for q, a in answers)

    utm = [(k, field(k, 200)) for k in UTM_KEYS]
    utm = [(k, v) for k, v in utm if v]
    if utm:
        msg += "\n" + "".join(f"{h(k)}: {h(v)}\n" for k, v in utm)
    page = field("page", 500)
    if page:
        msg += "\n" + h(page)
    msg += f"\n🕒 {now}"
    return msg


@app.route("/", methods=["POST", "OPTIONS"])
def lead():
    if request.method == "OPTIONS":
        resp = cors(app.make_response(("", 204)))
        resp.headers["Access-Control-Allow-Methods"] = "POST"
        resp.headers["Access-Control-Max-Age"] = "86400"
        return resp

    if ALLOWED_ORIGINS and request.headers.get("Origin", "") not in ALLOWED_ORIGINS:
        return reply(403, {"ok": False, "error": "origin"})

    # Honeypot: приховане поле, його заповнюють лише боти
    if field("website", 200):
        return reply(200, {"ok": True})

    name = field("name", 80)
    phone = re.sub(r"[^0-9+()\-\s]", "", field("phone", 25))
    digits = re.sub(r"\D", "", phone)
    if len(name) < 2:
        return reply(422, {"ok": False, "error": "name"})
    if not 10 <= len(digits) <= 15:
        return reply(422, {"ok": False, "error": "phone"})

    ip = (request.headers.get("X-Forwarded-For", "").split(",")[0].strip()
          or request.remote_addr or "")
    if rate_limited(ip):
        return reply(429, {"ok": False, "error": "rate"})

    now = datetime.now(KYIV).strftime("%d.%m.%Y %H:%M")
    quiz = field("quiz", 120)
    text = quiz_message(quiz, name, phone, now) if quiz else \
        site_message(name, phone, field("source", 120) or "Сайт", now)

    try:
        ok = send_telegram(text)
    except Exception as exc:  # мережа / Telegram недоступний
        app.logger.error("telegram send failed: %s", type(exc).__name__)
        ok = False
    if not ok:
        return reply(502, {"ok": False, "error": "send"})
    return reply(200, {"ok": True})
