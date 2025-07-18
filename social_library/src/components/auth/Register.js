import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    genres: []
  });
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableGenres = [
    "Mystery",
    "Fiction",
    "Non-fiction",
    "Science Fiction",
    "Fantasy",
    "Romance",
    "Horror",
    "Biography",
    "History",
    "Self-help"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear error when user types
  };

  const handleAddGenre = (genre) => {
    if (!formData.genres.includes(genre)) {
      setFormData({ ...formData, genres: [...formData.genres, genre] });
      setError(null); // Clear error when user selects a genre
    }
  };

  const handleRemoveGenre = (genre) => {
    setFormData({ ...formData, genres: formData.genres.filter(g => g !== genre) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Frontend validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }
    if (formData.genres.length < 2) {
      setError("Please select at least 2 genres");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/accounts/register/', {
        username: formData.email, // Using email as username
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        genres: formData.genres
      });

      // Save token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect to landing page
      navigate('/myaccount');
      
    } catch (err) {
      console.error('Registration error:', err.response?.data);
      if (err.response?.data) {
        // Handle specific field errors from Django
        if (err.response.data.email) {
          setError(`Email: ${err.response.data.email[0]}`);
        } else if (err.response.data.password) {
          setError(`Password: ${err.response.data.password[0]}`);
        } else if (err.response.data.genres) {
          setError(`Genres: ${err.response.data.genres[0]}`);
        } else {
          setError(err.response.data.message || 'Registration failed. Please try again.');
        }
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Styles (keep your existing styles)
  const containerStyle = {
    maxWidth: '600px',
    width: '100%',
    padding: '40px',
    background: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 0 25px rgba(255,105,180,0.6)',
  };

  const errorStyle = {
    color: '#dc3545',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: 'bold'
  };
    
      const rowStyle = {
        display: 'flex',
        gap: '20px',
        marginBottom: '20px'
      };
    
      const inputContainerStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      };
    
      const labelStyle = {
        marginBottom: '5px',
        fontSize: '1.1rem',
        fontWeight: '600',
        color: '#333'
      };
    
      const inputStyle = {
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
    
      // Genre selector styles
      const genreContainerStyle = {
        position: 'relative',
        width: '100%',
        padding: '10px 15px',
        fontSize: '1rem',
        border: '1px solid #ccc',
        borderRadius: '5px',
        cursor: 'pointer',
        minHeight: '50px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center'
      };
    
      const tagStyle = {
        backgroundColor: '#007bff',
        color: '#fff',
        padding: '5px 10px',
        borderRadius: '15px',
        marginRight: '10px',
        marginBottom: '5px',
        display: 'flex',
        alignItems: 'center'
      };
    
      const tagRemoveStyle = {
        marginLeft: '5px',
        cursor: 'pointer',
        fontWeight: 'bold'
      };
    
      const dropdownStyle = {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '5px',
        zIndex: 10,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        marginTop: '5px'
      };
    
      const dropdownOptionStyle = {
        padding: '10px 15px',
        cursor: 'pointer',
        borderBottom: '1px solid #eee'
      };
    
      const fullWidthStyle = {
        width: '100%',
        marginBottom: '20px'
      };
    
      const linkStyle = {
        fontSize: '1rem',
        color: '#007bff',
        textDecoration: 'none',
        fontWeight: 'bold'
      };

  // ... (keep all your other style definitions)

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
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#007bff' }}>Register to Social Lib</h2>
        
        {error && <div style={errorStyle}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {/* Row 1: First Name and Last Name */}
          <div style={rowStyle}>
            <div style={inputContainerStyle}>
              <label htmlFor="firstName" style={labelStyle}>First Name</label>
              <input 
                type="text" 
                name="firstName" 
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>
            <div style={inputContainerStyle}>
              <label htmlFor="lastName" style={labelStyle}>Last Name</label>
              <input 
                type="text" 
                name="lastName" 
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>
          </div>
          
          {/* Row 2: Email and Phone */}
          <div style={rowStyle}>
            <div style={inputContainerStyle}>
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
            <div style={inputContainerStyle}>
              <label htmlFor="phone" style={labelStyle}>Phone Number</label>
              <input 
                type="tel" 
                name="phone" 
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>
          </div>
          
          {/* Row 3: Password and Confirm Password */}
          <div style={rowStyle}>
            <div style={inputContainerStyle}>
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
            <div style={inputContainerStyle}>
              <label htmlFor="confirmPassword" style={labelStyle}>Confirm Password</label>
              <input 
                type="password" 
                name="confirmPassword" 
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>
          </div>
          
          {/* Row 4: Genre Selector */}
          <div style={fullWidthStyle}>
            <label htmlFor="genres" style={labelStyle}>Select at least 2 genres you are interested in</label>
            <div 
              style={genreContainerStyle}
              onClick={() => setShowGenreDropdown(!showGenreDropdown)}
            >
              {formData.genres.map((genre, index) => (
                <div key={index} style={tagStyle}>
                  {genre}
                  <span style={tagRemoveStyle} onClick={(e) => { e.stopPropagation(); handleRemoveGenre(genre); }}>×</span>
                </div>
              ))}
              <input 
                type="text" 
                placeholder="Select genres..." 
                style={{ 
                  border: 'none', 
                  outline: 'none', 
                  flex: 1, 
                  minWidth: '150px' 
                }}
                onFocus={() => setShowGenreDropdown(true)}
              />
              {showGenreDropdown && (
                <div style={dropdownStyle}>
                  {availableGenres.filter(g => !formData.genres.includes(g)).map((genre, index) => (
                    <div 
                      key={index} 
                      style={dropdownOptionStyle}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddGenre(genre);
                      }}
                    >
                      {genre}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Submit Button */}
          <div style={{ marginBottom: '20px' }}>
            <button 
              type="submit" 
              style={buttonStyle}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
        
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '1rem', color: '#555' }}>Already have an account? </span>
          <Link to="/login" style={linkStyle}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
