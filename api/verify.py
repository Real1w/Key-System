from http.server import BaseHTTPRequestHandler
import json
import os

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)
            
            key = data.get('key', '')
            hwid = data.get('hwid', '')
            
            # Load keys
            with open('keys.json', 'r') as f:
                keys_data = json.load(f)
            
            # Validate
            if not key or not hwid:
                self.send_error(400, 'Missing key or HWID')
                return
                
            if key not in keys_data['keys']:
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'valid': False, 'message': 'Invalid key'}).encode())
                return
                
            if key in keys_data['disabled_keys']:
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'valid': False, 'message': 'Key disabled'}).encode())
                return
            
            key_data = keys_data['keys'][key]
            
            if key_data['hwid'] != hwid:
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'valid': False, 'message': 'HWID mismatch'}).encode())
                return
                
            # Success
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'valid': True,
                'message': 'Key verified successfully',
                'user_name': key_data['user_name'],
                'generated_at': key_data['generated_at']
            }).encode())
            
        except Exception as e:
            self.send_error(500, f'Server error: {str(e)}')
