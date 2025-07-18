import React from 'react';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import HeroSection from '../components/core/HeroSection';
import BooksSection from '../components/core/BooksSection';

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <BooksSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
