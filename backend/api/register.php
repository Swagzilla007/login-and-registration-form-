<?php
require_once '../utils/CorsMiddleware.php';
require_once '../config/database.php';
require_once '../classes/User.php';
require_once '../utils/Security.php';

session_start();
CorsMiddleware::handleCors();

header("Content-Type: application/json; charset=UTF-8");

try {
    $data = json_decode(file_get_contents("php://input"));
    
    // Add CSRF validation before processing registration
    if (!isset($data->csrf_token)) {
        throw new Exception("Missing security token");
    }

    // Validate CSRF token
    $sessionToken = $_SESSION['csrf_token'] ?? null;
    $headerToken = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
    
    if (!$sessionToken || !$headerToken || !$data->csrf_token || 
        !hash_equals($sessionToken, $headerToken) || 
        !hash_equals($sessionToken, $data->csrf_token)) {
        error_log("CSRF token validation failed");
        throw new Exception("Invalid security token");
    }
    
    // Debug logging
    error_log("Registration data received: " . json_encode($data));
    
    // Validate required fields
    if (!isset($data->email) || !isset($data->password) || !isset($data->name)) {
        throw new Exception("Missing required fields");
    }

    // Validate email format
    if (!filter_var($data->email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Invalid email format");
    }

    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        throw new Exception("Database connection failed");
    }

    $user = new User($db);
    $result = $user->register($data->email, $data->password, $data->name);
    
    if ($result) {
        http_response_code(201);
        echo json_encode([
            "success" => true,
            "message" => "Registration successful"
        ]);
    } else {
        throw new Exception("Registration failed");
    }

} catch (Exception $e) {
    error_log("Registration error: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>
