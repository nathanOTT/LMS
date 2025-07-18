import React from 'react';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import Login from '../components/auth/Login';

const LoginPage = () => {
  return (
    <div>
      <Navbar />
      <Login />
      <Footer />
    </div>
  );
};

export default LoginPage;
