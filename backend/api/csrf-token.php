<?php
require_once '../utils/CorsMiddleware.php';
require_once '../utils/Security.php';

session_start();
CorsMiddleware::handleCors();

$token = Security::generateCSRFToken();

// Set the CSRF token in both session and cookie
$_SESSION['csrf_token'] = $token;
setcookie('CSRF-Token', $token, [
    'httponly' => true,
    'secure' => false, 
    'samesite' => 'Lax',
    'path' => '/'
]);

echo json_encode(['csrf_token' => $token]);
?>
