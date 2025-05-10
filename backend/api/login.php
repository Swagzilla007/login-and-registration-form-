<?php
session_start();
require_once '../utils/CorsMiddleware.php';
require_once '../config/database.php';
require_once '../classes/User.php';
require_once '../utils/Security.php';

CorsMiddleware::handleCors();

header("Content-Type: application/json; charset=UTF-8");

try {
    $data = json_decode(file_get_contents("php://input"));
    
    // Add cookie token validation
    $cookieToken = $_COOKIE['CSRF-Token'] ?? null;
    $sessionToken = $_SESSION['csrf_token'] ?? null;
    $headerToken = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
    
    if (!$cookieToken || !$sessionToken || !$headerToken || !$data->csrf_token || 
        !hash_equals($cookieToken, $sessionToken) || 
        !hash_equals($cookieToken, $headerToken) || 
        !hash_equals($cookieToken, $data->csrf_token)) {
        error_log("CSRF token validation failed");
        throw new Exception("Invalid security token");
    }
    
    // Debug logging
    error_log("Login request received: " . json_encode($data));
    
    if (!isset($data->email) || !isset($data->password) || !isset($data->csrf_token)) {
        throw new Exception("Missing required fields");
    }

    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        throw new Exception("Database connection failed");
    }

    $user = new User($db);
    // validateRequest will be called inside login method
    $result = $user->login($data->email, $data->password);
    
    // Make sure $result has the expected structure
    if (isset($result) && is_array($result)) {
        $_SESSION['user_id'] = $result['id'];
        $_SESSION['user_name'] = $result['name']; // Store user's name
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Login successful",
            "user" => [
                "id" => $result['id'],
                "name" => $result['name'],
                "email" => $result['email']
            ]
        ]);
    } else {
        throw new Exception("Invalid credentials");
    }

} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>
