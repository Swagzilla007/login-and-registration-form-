<?php
require_once '../config/database.php';
require_once '../utils/Security.php';

class User {
    private $conn;
    private $table_name = "users";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function register($email, $password, $name) {
        $query = "INSERT INTO " . $this->table_name . " SET email=:email, password=:password, name=:name";
        $stmt = $this->conn->prepare($query);
        
        $email = Security::sanitizeInput($email);
        $name = Security::sanitizeInput($name);
        $hashed_password = Security::hashPassword($password);
        
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":password", $hashed_password);
        $stmt->bindParam(":name", $name);
        
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function login($email, $password) {
        $query = "SELECT id, email, password FROM " . $this->table_name . " WHERE email = :email";
        $stmt = $this->conn->prepare($query);
        
        $email = Security::sanitizeInput($email);
        $stmt->bindParam(":email", $email);
        $stmt->execute();
        
        if($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            if(password_verify($password, $row['password'])) {
                return $row;
            }
        }
        return false;
    }
}
?>
