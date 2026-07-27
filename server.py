#!/usr/bin/env python3
"""
Smart Choice 3D - Fast Local Server
====================================
- THREADED -> ek saath kayi requests handle hoti hain
  (purana server.py sirf EK request ek time par handle
  karta tha, isi wajah se navigation slow tha)
- Smart caching:
    HTML  -> no-cache (har baar fresh, edits turant dikhein)
    JS/CSS/images/fonts/GLB -> cached (1 ghanta)
  (purana server har file pe no-cache laga deta tha, isi
  wajah se shoe.glb aur vendor files HAR page change par
  dobara download hoti thi)
- GLB/GLTF ke liye correct MIME types
"""

import http.server
import socketserver
import os
import sys

PORT = 8000

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

# Sirf ye extensions "always fresh" honi chahiye (active development).
# Baki sab (vendor JS/CSS, fonts, images, GLB model) cache ho sakti
# hain - yehi cheez nav ko fast banati hai.
NO_CACHE_EXTS = {'.html', ''}


class FastHandler(http.server.SimpleHTTPRequestHandler):

    def end_headers(self):
        ext = os.path.splitext(self.path.split('?')[0])[1].lower()

        if ext in NO_CACHE_EXTS:
            self.send_header('Cache-Control',
                              'no-store, no-cache, must-revalidate, max-age=0')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        else:
            # static assets -> browser ko cache karne do, dobara
            # download nahi karna padega jab tum nav se page badlo
            self.send_header('Cache-Control', 'public, max-age=3600')

        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Accept-Ranges', 'bytes')
        super().end_headers()

    def guess_type(self, path):
        ext = os.path.splitext(path)[1].lower()
        if ext in MIME_TYPES:
            return MIME_TYPES[ext]
        return super().guess_type(path)

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def log_message(self, format, *args):
        status = args[1] if len(args) > 1 else '?'
        path = args[0].split(' ')[1] if ' ' in args[0] else args[0]
        if any(ext in path.lower() for ext in ['.glb', '.gltf', '.html']):
            print(f"  [{status}] {path}")


class ThreadedServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    """Parallel requests handle karne ke liye - yehi main fix hai."""
    daemon_threads = True
    allow_reuse_address = True


def run():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    try:
        with ThreadedServer(("", PORT), FastHandler) as httpd:
            print(f"\n  Server chal raha hai: http://localhost:{PORT}")
            print(f"  Root folder      : {os.getcwd()}")
            print(f"  Mode             : THREADED (parallel requests)")
            print(f"  HTML cache       : OFF (always fresh)")
            print(f"  Static assets    : CACHED (fast navigation)")
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
