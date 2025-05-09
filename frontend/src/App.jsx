import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })
  const [csrfToken, setCsrfToken] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showWelcome, setShowWelcome] = useState(false)
  const [welcomeName, setWelcomeName] = useState('')

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
    try {
        const endpoint = isLogin ? 'login' : 'register';
        console.log('Submitting form:', formData); // Debug log

        const response = await axios.post(
            `http://localhost/login%20and%20registration%20form/backend/api/${endpoint}.php`,
            {
                ...formData,
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
                alert('Registration successful! Please login.');
                setIsLogin(true);
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (error) {
    return <div className="error-container">{error}</div>
  }

  return (
    <div className="auth-container">
      {showWelcome ? (
        <div className="welcome-dialog">
          <h2>Welcome, {welcomeName}!</h2>
          <p>You have successfully logged in.</p>
          <button onClick={() => setShowWelcome(false)}>Continue</button>
        </div>
      ) : (
        <>
          <h1>{isLogin ? 'Login' : 'Register'}</h1>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            )}
            <input
              type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
          </form>
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              className="toggle-btn"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </>
      )}
    </div>
  )
}

export default App
