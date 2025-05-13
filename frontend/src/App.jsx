import { useState, useEffect } from 'react'
import axios from 'axios'
import Login from './components/Login'
import Register from './components/Register'
import './App.css'

function App() {
  const [isLogin, setIsLogin] = useState(true)
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  })
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })
  const [csrfToken, setCsrfToken] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showWelcome, setShowWelcome] = useState(false)
  const [welcomeName, setWelcomeName] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false)
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false);

  // Add new state for captcha
  const [captcha, setCaptcha] = useState({
    code: '',
    userInput: ''
  });

  // Add new states for attempt tracking
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(null);

  // Add new state for tracking submission
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateName = (name) => {
    if (name.length < 4) {
      return 'Name must be at least 4 characters long';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (!/(?=.*[0-9])/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/(?=.*[a-zA-Z])/.test(password)) {
      return 'Password must contain at least one letter';
    }
    return '';
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  // Add validation info messages
  const validationInfo = {
    name: "Name must be at least 4 characters long",
    email: "Enter a valid email address (e.g., user@example.com)",
    password: "Password must:\n- Be at least 6 characters long\n- Contain at least one number\n- Contain at least one letter"
  };

  // Add captcha generation function
  const generateCaptcha = () => {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setCaptcha(prev => ({ ...prev, code: result }));
  };

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await axios.get(
          'http://localhost/login%20and%20registration%20form/backend/api/csrf-token.php',
          { withCredentials: true }
        )
        if (!response.data.csrf_token) {
          throw new Error('Invalid CSRF token received')
        }
        setCsrfToken(response.data.csrf_token)
      } catch (error) {
        setError('Failed to initialize security token')
        console.error('CSRF token fetch error:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCsrfToken()
    generateCaptcha();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    try {
        // Add captcha validation for registration
        if (!isLogin && captcha.userInput !== captcha.code) {
            alert('Invalid captcha code! Please try again.');  
            return; // Stop form submission
        }

        const endpoint = isLogin ? 'login' : 'register';
        const submitData = isLogin ? loginData : registerData;

        const response = await axios.post(
            `http://localhost/login%20and%20registration%20form/backend/api/${endpoint}.php`,
            {
                ...submitData,
                csrf_token: csrfToken
            },
            { 
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken
                }
            }
        );

        if (response.data.success) {
            // Clear errors and reset states on successful login
            setValidationErrors({
                name: '',
                email: '',
                password: ''
            });
            setIsSubmitted(false);
            setLoginAttempts(0);
            
            if (isLogin) {
                setShowWelcome(true);
                setWelcomeName(response.data.user.name);
            } else {
                setShowRegistrationSuccess(true);
            }
        }
    } catch (error) {
        console.log('Error:', error);
        
        if (isLogin) {
            const newAttempts = loginAttempts + 1;
            setLoginAttempts(newAttempts);
            
            setValidationErrors(prev => ({
                ...prev,
                password: 'Invalid password'
            }));

            if (newAttempts >= 3) {
                setLockoutTimer(30);
                const timer = setInterval(() => {
                    setLockoutTimer(prev => {
                        if (prev <= 1) {
                            clearInterval(timer);
                            setLoginAttempts(0);
                            setValidationErrors(prev => ({
                                ...prev,
                                password: ''
                            }));
                            setIsSubmitted(false);
                            return null;
                        }
                        return prev - 1;
                    });
                }, 1000);
            }
        } else {
            // Handle registration errors
            if (error.response?.data?.message?.includes('email already exists') || 
                error.response?.data?.message?.includes('already in use')) {
                setValidationErrors(prev => ({
                    ...prev,
                    email: 'This email is already registered'
                }));
            } else {
                setValidationErrors(prev => ({
                    ...prev,
                    email: error.response?.data?.message || 'Registration failed'
                }));
            }
        }
    }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isLogin) {
      setLoginData({
        ...loginData,
        [name]: value
      });
    } else {
      setRegisterData({
        ...registerData,
        [name]: value
      });
    }

    // Clear previous validation errors
    setValidationErrors({
      ...validationErrors,
      [name]: ''
    });

    // Validate on change
    if (name === 'name' && !isLogin) {
      setValidationErrors(prev => ({
        ...prev,
        name: validateName(value)
      }));
    } else if (name === 'password') {
      setValidationErrors(prev => ({
        ...prev,
        password: validatePassword(value)
      }));
    } else if (name === 'email') {
      setValidationErrors(prev => ({
        ...prev,
        email: validateEmail(value)
      }));
    }
  }

  // Add captcha input handler
  const handleCaptchaInput = (e) => {
    setCaptcha(prev => ({ ...prev, userInput: e.target.value }));
  };

  // Update form toggle to clear appropriate form
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setValidationErrors({
      name: '',
      email: '',
      password: ''
    });
    setPasswordError('');
  };

  return (
    <div className="auth-container">
      {showRegistrationSuccess ? (
        <div className="registration-dialog">
          <h2>Registration Successful! 🎉</h2>
          <p>Your account has been created successfully.<br/>Please login to continue.</p>
          <button onClick={() => {
            setShowRegistrationSuccess(false);
            setIsLogin(true);
            // Auto-fill login form with registered credentials
            setLoginData({
                email: registerData.email,
                password: registerData.password
            });
            // Reset registration form
            setRegisterData({
                email: '',
                password: '',
                confirmPassword: '',
                name: ''
            });
          }}>
            Proceed to Login
          </button>
        </div>
      ) : showWelcome ? (
        <div className="welcome-dialog">
          <h2>Welcome, {welcomeName}!</h2>
          <p>You have successfully logged in.</p>
          <button onClick={() => setShowWelcome(false)}>Continue</button>
        </div>
      ) : (
        <>
          {isLogin ? (
            <Login
              loginData={loginData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              validationInfo={validationInfo}
              validationErrors={validationErrors}
              toggleForm={toggleForm}
              lockoutTimer={lockoutTimer}
              attemptsLeft={3 - loginAttempts}
              isSubmitted={isSubmitted}
            />
          ) : (
            <Register
              registerData={registerData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              validationInfo={validationInfo}
              validationErrors={validationErrors}
              passwordError={passwordError}
              captcha={captcha}
              handleCaptchaInput={handleCaptchaInput}
              generateCaptcha={generateCaptcha}
              toggleForm={toggleForm}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
