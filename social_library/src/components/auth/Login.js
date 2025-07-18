import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:8000/api/accounts/login/', formData);
      
      // Save token and user data on success
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect to landing page
      navigate('/myaccount');
    } catch (err) {
      console.error("Login error:", err.response);
      if (err.response && err.response.data) {
        // Display error returned by DRF, e.g., "Unable to log in with provided credentials."
        setError(err.response.data.detail || "Login failed. Please try again.");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerStyle = {
    maxWidth: '400px',
    width: '100%',
    padding: '40px',
    background: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 0 25px rgba(0, 123, 255, 0.6)',
  };

  const formGroupStyle = {
    marginBottom: '20px',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '5px',
    color: '#333',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    fontSize: '1.2rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const errorStyle = {
    color: '#dc3545',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: 'bold',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={containerStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#007bff' }}>
          Sign In to Social Lib
        </h2>
        {error && <div style={errorStyle}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label htmlFor="email" style={labelStyle}>Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="password" style={labelStyle}>Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <span style={{ fontSize: '1rem', color: '#555' }}>
            Don't have an account?{" "}
          </span>
          <Link to="/register" style={{
            fontSize: '1rem',
            color: '#007bff',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}>
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

