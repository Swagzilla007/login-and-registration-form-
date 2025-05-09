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
    
    // Debug logging
    error_log("Login request received: " . json_encode($data));
    
    if (!isset($data->email) || !isset($data->password)) {
        throw new Exception("Missing email or password");
    }

    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        throw new Exception("Database connection failed");
    }

    $user = new User($db);
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
