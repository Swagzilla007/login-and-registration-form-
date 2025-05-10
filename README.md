# Login and Registration System

A modern, secure login and registration system built with React and PHP.

## Tech Stack

### Frontend
- React 18
- Axios for API calls
- CSS3 with modern animations
- Responsive design

### Backend
- PHP 8
- MySQL/MariaDB
- PDO for database connections
- CSRF protection
- Input sanitization

## Features
- User registration with email verification
- Secure login system
- Password strength validation
- CAPTCHA protection
- Form validation
- Responsive design
- Remember me functionality
- CSRF protection
- Modern UI with animations
- Error handling
- Input sanitization

## Prerequisites
- Node.js (v14 or higher)
- XAMPP (with PHP 8 and MySQL)
- Web browser (Chrome, Firefox, Safari, or Edge)

## Setup Instructions

### Database Setup
1. Start XAMPP Control Panel
2. Start Apache and MySQL services
3. Open phpMyAdmin (http://localhost/phpmyadmin)
4. Create a new database named `user_auth`
5. Import the SQL file from `backend/database/user_auth.sql`

### Backend Setup
1. Navigate to XAMPP's htdocs folder:
```bash
cd C:\xampp\htdocs
```

2. Clone the repository:
```bash
git clone <repository-url>
```

3. Configure database connection:
   - Open `backend/config/database.php`
   - Update database credentials if different from default

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Running the Application
1. Ensure XAMPP's Apache and MySQL services are running
2. Start the React development server
3. Access the application at http://localhost:5173

## Security Features
- Password hashing using PHP's password_hash()
- CSRF token protection
- Input sanitization
- Prepared SQL statements
- Secure session handling
- CAPTCHA verification
- Content Security Policy headers

## Development
1. Frontend code is in `frontend/src`
2. Backend API endpoints are in `backend/api`
3. Database configuration in `backend/config`
4. Utility functions in `backend/utils`

## Production Deployment
1. Build the React application:
```bash
npm run build
```

2. Copy the build files to your web server
3. Configure your web server to point to the build directory
4. Update API endpoints to production URLs
5. Enable HTTPS
6. Configure proper security headers

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
