"""Загрузка изображений инструментов в S3-хранилище"""
import base64
import json
import mimetypes
import os
import uuid

import boto3

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_SIZE_MB = 5


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    body = json.loads(event.get("body") or "{}")
    file_data = body.get("file")
    file_name = body.get("name", "image.jpg")
    content_type = body.get("type", "image/jpeg")

    if not file_data:
        return error(400, "Файл не передан")

    if content_type not in ALLOWED_TYPES:
        return error(400, "Допустимые форматы: JPEG, PNG, WebP, GIF")

    # decode base64
    if "," in file_data:
        file_data = file_data.split(",", 1)[1]

    image_bytes = base64.b64decode(file_data)

    if len(image_bytes) > MAX_SIZE_MB * 1024 * 1024:
        return error(400, f"Файл слишком большой. Максимум {MAX_SIZE_MB} МБ")

    ext = mimetypes.guess_extension(content_type) or ".jpg"
    if ext == ".jpe":
        ext = ".jpg"
    key = f"tools/{uuid.uuid4().hex}{ext}"

    s3 = boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )

    s3.put_object(
        Bucket="files",
        Key=key,
        Body=image_bytes,
        ContentType=content_type,
    )

    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"

    return {
        "statusCode": 200,
        "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
        "body": json.dumps({"url": cdn_url}, ensure_ascii=False),
    }


def error(status, message):
    return {
        "statusCode": status,
        "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
        "body": json.dumps({"error": message}, ensure_ascii=False),
    }
