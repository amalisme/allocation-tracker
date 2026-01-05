#!/usr/bin/env python3
"""
Simple HTTPS server for testing PWA locally
Run this and visit https://localhost:8000 on your phone
"""

import http.server
import ssl
import os

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add headers for PWA
        self.send_header('Service-Worker-Allowed', '/')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

os.chdir('/home/claude/allocation-tracker')

server_address = ('', 8000)
httpd = http.server.HTTPServer(server_address, MyHTTPRequestHandler)

print("🚀 Server running at http://localhost:8000")
print("📱 Access from phone using your computer's IP address")
print("   Example: http://192.168.1.x:8000")
print("\nPress Ctrl+C to stop")

httpd.serve_forever()
