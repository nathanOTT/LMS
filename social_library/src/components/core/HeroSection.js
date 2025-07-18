// src/components/hero/HeroSection.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import hero1 from '../../assets/images/hero1.jpg';
import hero3 from '../../assets/images/hero3.jpg';
import hero4 from '../../assets/images/hero4.jpg';

const HeroSection = () => {
  const navigate = useNavigate();
  const images = [hero1, hero3, hero4];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(false);
  
  // Check for user in localStorage.
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Change images every 5 seconds with fade transition.
    const intervalId = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
        setFade(false);
      }, 500); // 0.5 sec fade out/in
    }, 5000);

    return () => clearInterval(intervalId);
  }, [images.length]);

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <section style={{
      display: 'flex',
      alignItems: 'center',
      padding: '50px 20px',
      minHeight: '500px',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      {/* Left Section: Full-Width Sliding Hero Image */}
      <div style={{ flex: 1, padding: '20px', height: '100%' }}>
        <div style={{
          width: '100%',
          height: '100%',
          margin: '0 auto',
          overflow: 'hidden',
          borderRadius: '10px',
          position: 'relative'
        }}>
          <img
            src={images[currentIndex]}
            alt="Hero Slide"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: fade ? 0 : 1,
              transition: 'opacity 0.5s ease',
              boxShadow: '0 0 20px 10px rgba(255,105,180,0.7)', // glowing pink shadow
            }}
          />
        </div>
      </div>

      {/* Right Section: Enhanced Text Content */}
      <div style={{ flex: 1, padding: '20px' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', lineHeight: '1.2' }}>
          <span style={{ color: '#007bff' }}>Welcome</span> to <span style={{ color: '#28a745' }}>Social</span> Lib
        </h1>
        <p style={{ fontSize: '1.5rem', lineHeight: '1.8', marginBottom: '30px' }}>
          <span style={{ color: '#dc3545' }}>Discover</span> a world where you can <span style={{ color: '#fd7e14' }}>borrow</span> an extensive collection of books while engaging with a thriving social community. <br />
          Join our forum to <span style={{ color: '#20c997' }}>discuss</span>, share insights, and connect with fellow readers in a dynamic and interactive environment.
        </p>
        {/* Render Get Started button only if the user is not logged in */}
        {!user && (
          <button 
            onClick={handleGetStarted} 
            style={{
              padding: '15px 30px', 
              fontSize: '1.5rem', 
              backgroundColor: '#007bff', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0, 123, 255, 0.3)',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
          >
            Get Started
          </button>
        )}
      </div>
    </section>
  );
};

export default HeroSection;



