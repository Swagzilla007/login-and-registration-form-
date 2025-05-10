import React from 'react';

const Login = ({ 
  loginData, 
  handleChange, 
  handleSubmit, 
  showPassword, 
  setShowPassword,
  validationInfo,
  validationErrors,
  toggleForm,
  lockoutTimer,
  attemptsLeft,
  isSubmitted
}) => {
  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="title">Login</div>
      
      <label>
        <input
          className="input"
          type="email"
          name="email"
          required
          value={loginData.email}
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
          value={loginData.password}
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
      </label>

      <div className="remember-me">
        <input 
          type="checkbox" 
          id="remember-me"
        />
        <label htmlFor="remember-me">Remember me</label>
      </div>

      {isSubmitted && validationErrors.password && (
        <div className="error-container">
          <div className="error-message">
            Invalid password - {attemptsLeft} {attemptsLeft === 1 ? 'attempt' : 'attempts'} remaining
          </div>
        </div>
      )}

      <button 
        className="submit" 
        type="submit"
        disabled={lockoutTimer !== null}
      >
        {lockoutTimer 
          ? `Wait ${lockoutTimer}s to try again` 
          : 'Login'}
      </button>

      <p className="signin">
        Don't have an account?{" "}
        <button type="button" onClick={toggleForm}>
          Register
        </button>
      </p>
    </form>
  );
};

export default Login;
