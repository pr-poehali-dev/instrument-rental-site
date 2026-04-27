"""Отправка заявок с сайта на почту chernov.od@yandex.ru"""
import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_HOST = "smtp.yandex.ru"
SMTP_PORT = 465
SMTP_USER = "chernov.od@yandex.ru"
TO_EMAIL = "chernov.od@yandex.ru"

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    body = json.loads(event.get("body") or "{}")
    name = body.get("name", "").strip()
    phone = body.get("phone", "").strip()
    message = body.get("message", "").strip()

    if not name or not phone:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "Имя и телефон обязательны"}, ensure_ascii=False),
        }

    subject = f"Новая заявка на прокат — {name}"
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 24px;">
        <h2 style="color: #1a1a1a; margin-bottom: 24px;">Новая заявка с сайта ПроИнструмент</h2>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 10px 0; color: #666; width: 120px;"><b>Имя:</b></td>
                <td style="padding: 10px 0; color: #1a1a1a;">{name}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; color: #666;"><b>Телефон:</b></td>
                <td style="padding: 10px 0; color: #1a1a1a;">{phone}</td>
            </tr>
            {"<tr><td style='padding: 10px 0; color: #666;'><b>Сообщение:</b></td><td style='padding: 10px 0; color: #1a1a1a;'>" + message + "</td></tr>" if message else ""}
        </table>
    </div>
    """

    smtp_password = os.environ.get("SMTP_PASSWORD", "")

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = SMTP_USER
    msg["To"] = TO_EMAIL
    msg.attach(MIMEText(html, "html", "utf-8"))

    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
        server.login(SMTP_USER, smtp_password)
        server.sendmail(SMTP_USER, TO_EMAIL, msg.as_string())

    return {
        "statusCode": 200,
        "headers": CORS_HEADERS,
        "body": json.dumps({"ok": True}, ensure_ascii=False),
    }
