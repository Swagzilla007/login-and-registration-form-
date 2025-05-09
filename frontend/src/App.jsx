import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
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
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPasswordError('');

    // Validate all fields before submission
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    let nameError = '';
    
    if (!isLogin) {
      nameError = validateName(formData.name);
      if (formData.password !== formData.confirmPassword) {
        setPasswordError('Passwords do not match');
        return;
      }
    }

    if (emailError || passwordError || (!isLogin && nameError)) {
      setValidationErrors({
        email: emailError,
        password: passwordError,
        name: nameError
      });
      return;
    }

    try {
        const endpoint = isLogin ? 'login' : 'register';
        console.log('Submitting form:', formData); // Debug log

        // Remove confirmPassword before sending to API
        const { confirmPassword, ...submitData } = formData;

        const response = await axios.post(
            `http://localhost/login%20and%20registration%20form/backend/api/${endpoint}.php`,
            {
                ...submitData,
                csrf_token: csrfToken // Add CSRF token to request body
            },
            { 
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken // Add CSRF token to headers
                }
            }
        );
        
        console.log('Response:', response.data); // Debug log
        
        if (response.data.success) {
            if (isLogin) {
                setWelcomeName(response.data.user.name);
                setShowWelcome(true);
            } else {
                setShowRegistrationSuccess(true); // Show registration success dialog
            }
        } else {
            setError(response.data.message);
        }
    } catch (error) {
        console.error('Error details:', error.response || error); // Debug log
        setError(
            error.response?.data?.message || 
            `${isLogin ? 'Login' : 'Registration'} failed. Please try again.`
        );
    }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

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

  return (
    <div className="auth-container">
      {showRegistrationSuccess ? (
        <div className="registration-dialog">
          <h2>Registration Successful! 🎉</h2>
          <p>Your account has been created successfully.<br/>Please login to continue.</p>
          <button onClick={() => {
            setShowRegistrationSuccess(false);
            setIsLogin(true);
            setFormData({
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
        <form className="form" onSubmit={handleSubmit}>
          <div className="title">{isLogin ? 'Login' : 'Register'}</div>
          
          {!isLogin && (
            <label>
              <input
                className="input"
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
              />
              <span>Name</span>
              <button type="button" className="info-icon" tabIndex="-1">
                ℹ️
                <span className="tooltip">{validationInfo.name}</span>
              </button>
              {validationErrors.name && (
                <div className="error-message">{validationErrors.name}</div>
              )}
            </label>
          )}

          <label>
            <input
              className="input"
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <span>Email</span>
            <button type="button" className="info-icon" tabIndex="-1">
              ℹ️
              <span className="tooltip">{validationInfo.email}</span>
            </button>
            {validationErrors.email && (
              <div className="error-message">{validationErrors.email}</div>
            )}
          </label>

          <label>
            <input
              className="input"
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <span>Password</span>
            <button type="button" className="info-icon" tabIndex="-1">
              ℹ️
              <span className="tooltip">{validationInfo.password}</span>
            </button>
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
            {validationErrors.password && (
              <div className="error-message">{validationErrors.password}</div>
            )}
          </label>

          {!isLogin && (
            <label>
              <input
                className="input"
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <span>Confirm Password</span>
              {passwordError && (
                <div className="error-message">{passwordError}</div>
              )}
            </label>
          )}

          {isLogin && (
            <div className="remember-me">
              <input 
                type="checkbox" 
                id="remember-me"
              />
              <label htmlFor="remember-me">Remember me</label>
            </div>
          )}

          <button className="submit" type="submit">
            {isLogin ? 'Login' : 'Register'}
          </button>

          <p className="signin">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button type="button" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </form>
      )}
    </div>
  );
}

export default App
