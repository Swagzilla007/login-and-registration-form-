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

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(
          'http://localhost/login%20and%20registration%20form/backend/api/csrf-token.php',
          { withCredentials: true }
        )
        setCsrfToken(response.data.csrf_token)
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error)
      }
    }
    fetchCsrfToken()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const endpoint = isLogin ? 'login' : 'register'
      const response = await axios.post(
        `http://localhost/login%20and%20registration%20form/backend/api/${endpoint}.php`,
        {
          ...formData,
          csrf_token: csrfToken
        },
        { withCredentials: true }
      )
      alert(response.data.message)
      if (isLogin && response.data.id) {
        // Handle successful login (e.g., store token, redirect)
        console.log('Logged in successfully')
      }
    } catch (error) {
      alert(error.response?.data?.message || 'An error occurred')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="auth-container">
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
    </div>
  )
}

export default App
