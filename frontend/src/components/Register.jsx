import React from 'react';

const Register = ({
  registerData,
  handleChange,
  handleSubmit,
  showPassword,
  setShowPassword,
  validationInfo,
  validationErrors,
  passwordError,
  captcha,
  handleCaptchaInput,
  generateCaptcha,
  toggleForm
}) => {
  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="title">Register</div>
      
      <label>
        <input
          className="input"
          type="text"
          name="name"
          required
          value={registerData.name}
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

      <label>
        <input
          className="input"
          type="email"
          name="email"
          required
          value={registerData.email}
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
          value={registerData.password}
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

      <label>
        <input
          className="input"
          type="password"
          name="confirmPassword"
          required
          value={registerData.confirmPassword}
          onChange={handleChange}
        />
        <span>Confirm Password</span>
        {passwordError && (
          <div className="error-message">{passwordError}</div>
        )}
      </label>

      <div className="captcha-container">
        <div className="captcha-code">{captcha.code}</div>
        <button 
          type="button" 
          className="refresh-captcha" 
          onClick={generateCaptcha}
        >
          🔄
        </button>
      </div>
      <input
        className="captcha-input"
        type="text"
        placeholder="Enter captcha code"
        value={captcha.userInput}
        onChange={handleCaptchaInput}
        required
      />

      <button className="submit" type="submit">Register</button>

      <p className="signin">
        Already have an account?{" "}
        <button type="button" onClick={toggleForm}>
          Login
        </button>
      </p>
    </form>
  );
};

export default Register;
