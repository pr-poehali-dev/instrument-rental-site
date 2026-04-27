"""CRUD API для управления инструментами проката"""
import json
import os
import psycopg

SCHEMA = "t_p87698122_instrument_rental_si"

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def get_db_conn():
    return psycopg.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    method = event.get("httpMethod", "GET")

    if method == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    path = event.get("path", "/")
    # Extract tool id from path like /tools/123
    path_parts = [p for p in path.split("/") if p]
    tool_id = None
    if len(path_parts) >= 2 and path_parts[-1].isdigit():
        tool_id = int(path_parts[-1])

    try:
        if method == "GET":
            return get_tools()
        elif method == "POST":
            body = json.loads(event.get("body") or "{}")
            return create_tool(body)
        elif method == "PUT" and tool_id:
            body = json.loads(event.get("body") or "{}")
            return update_tool(tool_id, body)
        elif method == "DELETE" and tool_id:
            return delete_tool(tool_id)
        else:
            return error(405, "Method not allowed")
    except Exception as e:
        return error(500, str(e))


def get_tools():
    with get_db_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"SELECT id, name, category, price, available, image, description, created_at FROM {SCHEMA}.tools ORDER BY id"
            )
            rows = cur.fetchall()
            tools = [
                {
                    "id": r[0],
                    "name": r[1],
                    "category": r[2],
                    "price": r[3],
                    "available": r[4],
                    "image": r[5],
                    "description": r[6],
                    "created_at": r[7].isoformat() if r[7] else None,
                }
                for r in rows
            ]
    return ok(tools)


def create_tool(body):
    name = (body.get("name") or "").strip()
    category = (body.get("category") or "").strip()
    price = int(body.get("price") or 0)
    available = bool(body.get("available", True))
    image = (body.get("image") or "").strip()
    description = (body.get("description") or "").strip()

    if not name or not category:
        return error(400, "Название и категория обязательны")

    with get_db_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"""INSERT INTO {SCHEMA}.tools (name, category, price, available, image, description)
                    VALUES (%s, %s, %s, %s, %s, %s) RETURNING id""",
                (name, category, price, available, image, description),
            )
            new_id = cur.fetchone()[0]
        conn.commit()

    return ok({"id": new_id, "message": "Инструмент добавлен"}, status=201)


def update_tool(tool_id, body):
    name = (body.get("name") or "").strip()
    category = (body.get("category") or "").strip()
    price = int(body.get("price") or 0)
    available = bool(body.get("available", True))
    image = (body.get("image") or "").strip()
    description = (body.get("description") or "").strip()

    if not name or not category:
        return error(400, "Название и категория обязательны")

    with get_db_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"""UPDATE {SCHEMA}.tools
                    SET name=%s, category=%s, price=%s, available=%s, image=%s, description=%s, updated_at=NOW()
                    WHERE id=%s""",
                (name, category, price, available, image, description, tool_id),
            )
            if cur.rowcount == 0:
                return error(404, "Инструмент не найден")
        conn.commit()

    return ok({"message": "Инструмент обновлён"})


def delete_tool(tool_id):
    with get_db_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(f"DELETE FROM {SCHEMA}.tools WHERE id=%s", (tool_id,))
            if cur.rowcount == 0:
                return error(404, "Инструмент не найден")
        conn.commit()

    return ok({"message": "Инструмент удалён"})


def ok(data, status=200):
    return {
        "statusCode": status,
        "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
        "body": json.dumps(data, ensure_ascii=False),
    }


def error(status, message):
    return {
        "statusCode": status,
        "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
        "body": json.dumps({"error": message}, ensure_ascii=False),
    }
