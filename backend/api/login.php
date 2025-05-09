<?php
require_once '../utils/CorsMiddleware.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("X-XSS-Protection: 1; mode=block");
header("Content-Security-Policy: default-src 'self'");

include_once '../config/database.php';
include_once '../classes/User.php';

session_start();
CorsMiddleware::handleCors();

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->email) &&
    !empty($data->password) &&
    !empty($data->csrf_token) &&
    Security::validateCSRFToken($data->csrf_token)
){
    $result = $user->login($data->email, $data->password);
    if($result){
        $_SESSION['user_id'] = $result['id'];
        http_response_code(200);
        echo json_encode(array(
            "message" => "Login successful.",
            "id" => $result['id'],
            "email" => $result['email']
        ));
    } else {
        http_response_code(401);
        echo json_encode(array("message" => "Invalid credentials."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Invalid input data."));
}
?>
