<?php
class CorsMiddleware {
    public static function handleCors() {
        // Allow from any origin
        $allowedOrigins = [
            'http://localhost:5173',  // Vite default port
            'http://127.0.0.1:5173'
        ];
        
        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
        
        if (in_array($origin, $allowedOrigins)) {
            header("Access-Control-Allow-Origin: " . $origin);
            header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
            header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
            header("Access-Control-Allow-Credentials: true");
        }

        // Handle preflight requests
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            http_response_code(200);
            exit();
        }
    }
}
?>
