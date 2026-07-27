#!/usr/bin/env python3
"""
Smart Choice 3D - No-Cache Local Server
========================================
- GLB/GLTF ke liye correct MIME types
- Sabhi responses par no-cache headers
- Cache-busting support
- Service Worker interference se protection
"""

import http.server
import socketserver
import os
import sys

PORT = 8000

# ---- MIME Types (GLB/GLTF ke liye zaroori) ----
MIME_TYPES = {
    # 3D Assets
    '.glb':  'model/gltf-binary',
    '.gltf': 'model/gltf+json',
    '.bin':  'application/octet-stream',
    # Web
    '.html': 'text/html; charset=utf-8',
    '.css':  'text/css; charset=utf-8',
    '.js':   'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    # Images / Textures
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg':  'image/svg+xml',
    '.ico':  'image/x-icon',
    # Fonts
    '.woff':  'font/woff',
    '.woff2': 'font/woff2',
    '.ttf':   'font/ttf',
    '.otf':   'font/otf',
    # Other
    '.mp4':  'video/mp4',
    '.webm': 'video/webm',
    '.mp3':  'audio/mpeg',
    '.wav':  'audio/wav',
}

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):

    def end_headers(self):
        """Har response par no-cache headers add karo"""
        # ---- Core no-cache headers ----
        self.send_header('Cache-Control',
                         'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma',       'no-cache')
        self.send_header('Expires',      '0')

        # ---- CORS (localhost ke liye) ----
        self.send_header('Access-Control-Allow-Origin',  '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')

        # ---- GLB range requests support ----
        self.send_header('Accept-Ranges', 'bytes')

        super().end_headers()

    def guess_type(self, path):
        """Custom MIME type detection - GLB/GLTF ke liye critical"""
        ext = os.path.splitext(path)[1].lower()
        if ext in MIME_TYPES:
            return MIME_TYPES[ext]
        return super().guess_type(path)

    def do_OPTIONS(self):
        """CORS preflight handle karo"""
        self.send_response(200)
        self.end_headers()

    def log_message(self, format, *args):
        """Clean log output"""
        status = args[1] if len(args) > 1 else '?'
        path   = args[0].split(' ')[1] if ' ' in args[0] else args[0]
        # Sirf important requests print karo
        if any(ext in path.lower() for ext in ['.glb', '.gltf', '.html', '.js', '.css']):
            print(f"  [{status}] {path}")
        else:
            super().log_message(format, *args)


def run():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    handler = NoCacheHandler

    # SO_REUSEADDR - port reuse allow karo
    socketserver.TCPServer.allow_reuse_address = True

    try:
        with socketserver.TCPServer(("", PORT), handler) as httpd:
            print(f"\n  Server chal raha hai: http://localhost:{PORT}")
            print(f"  Root folder      : {os.getcwd()}")
            print(f"  Cache            : DISABLED")
            print(f"  GLB/GLTF MIME    : model/gltf-binary , model/gltf+json")
            print(f"\n  Ctrl+C daba kar band karo\n")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n  Server band ho gaya.")
    except OSError as e:
        print(f"\n  ERROR: Port {PORT} use ho raha hai! ({e})")
        print(f"  start-server.bat dobara chalao - woh port free karega.")
        sys.exit(1)


if __name__ == '__main__':
    run()
