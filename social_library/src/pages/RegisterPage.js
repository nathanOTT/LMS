import React from 'react';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import Register from '../components/auth/Register';

const RegisterPage = () => {
  return (
    <div>
      <Navbar />
      <Register />
      <Footer />
    </div>
  );
};

export default RegisterPage;
