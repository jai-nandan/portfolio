"""
Vercel Python Serverless Function — /api/contact

Receives the contact form's JSON payload, validates it, and returns a
JSON response. This function has no persistent database or SMTP wired
up by default (both need account-specific credentials), so it currently
validates the input and echoes a success response. To actually deliver
messages, plug in an email provider (e.g. Resend, SendGrid) or a
webhook using environment variables configured in the Vercel dashboard.

The frontend (js/contact.js) already handles the case where this
endpoint is unavailable, so the site keeps working even without it.
"""

from http.server import BaseHTTPRequestHandler
import json
import re

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def _send_json(handler, status, payload):
    body = json.dumps(payload).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json")
    handler.send_header("Access-Control-Allow-Origin", "*")
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
            data = json.loads(raw.decode("utf-8") or "{}")
        except (ValueError, TypeError):
            _send_json(self, 400, {"ok": False, "error": "Invalid JSON payload."})
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
            errors["message"] = "Message must be at least 10 characters."

        if errors:
            _send_json(self, 422, {"ok": False, "errors": errors})
            return

        # TODO: wire up an email/webhook provider here using env vars,
        # e.g. requests.post(RESEND_API_URL, ...) with an API key stored
        # as a Vercel environment variable.

        _send_json(self, 200, {
            "ok": True,
            "message": "Thanks, {}! Your message has been received.".format(name),
        })

    def do_GET(self):
        _send_json(self, 405, {"ok": False, "error": "Use POST to submit the contact form."})
