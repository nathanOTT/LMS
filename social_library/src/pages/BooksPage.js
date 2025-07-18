import React from 'react';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import BooksSection from '../components/core/BooksSection';

const BooksPage = () => {
  return (
    <div>
      <Navbar />
      <BooksSection />
      <Footer />
    </div>
  );
};

export default BooksPage;

