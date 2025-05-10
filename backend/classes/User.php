<?php
require_once '../config/database.php';
require_once '../utils/Security.php';

class User {
    private $conn;
    private $table_name = "users";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function validateRequest($requestToken) {
        // Get tokens from different sources
        $sessionToken = $_SESSION['csrf_token'] ?? null;
        $headerToken = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
        
        // Validate all three tokens match
        if (!$sessionToken || !$headerToken || !$requestToken || 
            !hash_equals($sessionToken, $headerToken) || 
            !hash_equals($sessionToken, $requestToken)) {
            error_log("CSRF token validation failed");
            throw new Exception("Invalid security token");
        }
        
        return true;
    }

    public function register($email, $password, $name) {
        try {
            // Add CSRF validation at the start of register
            $data = json_decode(file_get_contents("php://input"));
            $this->validateRequest($data->csrf_token);

            // Debug logging
            error_log("Starting registration for email: " . $email);

            // Sanitize inputs before checking
            $email = Security::sanitizeInput($email);
            $name = Security::sanitizeInput($name);
            
            // Check if email already exists
            $check_query = "SELECT id FROM " . $this->table_name . " WHERE email = :email";
            $check_stmt = $this->conn->prepare($check_query);
            $check_stmt->bindParam(":email", $email);
            $check_stmt->execute();
            
            if($check_stmt->rowCount() > 0) {
                error_log("Email already exists: " . $email);
                throw new Exception("Email already exists");
            }

            $hashed_password = Security::hashPassword($password);
            
            $query = "INSERT INTO " . $this->table_name . " (email, password, name) VALUES (:email, :password, :name)";
            $stmt = $this->conn->prepare($query);
            
            $stmt->bindParam(":email", $email);
            $stmt->bindParam(":password", $hashed_password);
            $stmt->bindParam(":name", $name);
            
            if($stmt->execute()) {
                error_log("Registration successful for: " . $email);
                return true;
            }
            
            error_log("Registration failed for: " . $email);
            return false;
            
        } catch(PDOException $e) {
            error_log("Database error: " . $e->getMessage());
            throw new Exception("Database error occurred");
        }
    }

    public function login($email, $password) {
        try {
            // Add CSRF validation at the start of login
            $data = json_decode(file_get_contents("php://input"));
            $this->validateRequest($data->csrf_token);

            $email = Security::sanitizeInput($email);
            
            $query = "SELECT id, email, password, name FROM " . $this->table_name . " WHERE email = :email";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":email", $email);
            $stmt->execute();
            
            if($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                if(password_verify($password, $row['password'])) {
                    return [
                        'id' => $row['id'],
                        'email' => $row['email'],
                        'name' => $row['name']
                    ];
                }
            }
            throw new Exception("Invalid email or password");
            
        } catch(PDOException $e) {
            error_log("Database error during login: " . $e->getMessage());
            throw new Exception("Login failed");
        }
    }
}
?>
