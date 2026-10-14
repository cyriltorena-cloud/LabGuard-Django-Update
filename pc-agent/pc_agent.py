"""Development-only local PC ID helper. This does NOT lock or secure Windows."""
import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

CONFIG_PATH = Path(__file__).with_name("config.json")
config = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
COMPUTER_ID = str(config.get("computer_id", "")).strip()
PORT = int(config.get("port", 8765))
if not COMPUTER_ID:
    raise SystemExit("Set computer_id in config.json before starting the agent.")

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path.rstrip("/") != "/pc-id":
            self.send_response(404); self.end_headers(); return
        body = json.dumps({"computer_id": COMPUTER_ID, "agent": "development-only"}).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)
    def log_message(self, format, *args):
        print("[PC agent]", format % args)

if __name__ == "__main__":
    server = HTTPServer(("127.0.0.1", PORT), Handler)
    print(f"Development PC agent running at http://127.0.0.1:{PORT}/pc-id for {COMPUTER_ID}")
    print("WARNING: This only reports a configured PC ID; it does not lock Windows.")
    try: server.serve_forever()
    except KeyboardInterrupt: print("Stopping PC agent...")
    finally: server.server_close()
