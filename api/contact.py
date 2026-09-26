from http.server import BaseHTTPRequestHandler
import json
import re

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def send_json(handler, status, payload):
    body = json.dumps(payload).encode("utf-8")

    handler.send_response(status)
    handler.send_header("Content-Type", "application/json")
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
    handler.send_header("Access-Control-Allow-Headers", "Content-Type")
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)


class handler(BaseHTTPRequestHandler):

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", 0))

            raw = self.rfile.read(length) if length else b"{}"

            data = json.loads(
                raw.decode("utf-8") or "{}"
            )

        except (ValueError, TypeError, json.JSONDecodeError):
            send_json(
                self,
                400,
                {
                    "ok": False,
                    "error": "Invalid JSON payload."
                }
            )
            return

        name = (data.get("name") or "").strip()
        email = (data.get("email") or "").strip()
        subject = (data.get("subject") or "").strip()
        message = (data.get("message") or "").strip()

        errors = {}

        if not name:
            errors["name"] = "Name is required."

        if not EMAIL_RE.match(email):
            errors["email"] = "A valid email is required."

        if not subject:
            errors["subject"] = "Subject is required."

        if len(message) < 10:
            errors["message"] = (
                "Message must be at least 10 characters."
            )

        if errors:
            send_json(
                self,
                422,
                {
                    "ok": False,
                    "errors": errors
                }
            )
            return

        # Form validation successful.
        # Add an email provider here later if you want
        # these messages to be delivered to your inbox.

        send_json(
            self,
            200,
            {
                "ok": True,
                "message": (
                    f"Thanks, {name}! "
                    "Your message has been received."
                )
            }
        )

    def do_GET(self):
        send_json(
            self,
            405,
            {
                "ok": False,
                "error": "Use POST to submit the contact form."
            }
        )
