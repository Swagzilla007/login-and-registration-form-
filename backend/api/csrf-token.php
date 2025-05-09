<?php
require_once '../utils/CorsMiddleware.php';
require_once '../utils/Security.php';

session_start();
CorsMiddleware::handleCors();

$token = Security::generateCSRFToken();
echo json_encode(['csrf_token' => $token]);
?>
