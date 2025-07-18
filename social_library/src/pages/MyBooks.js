// src/pages/MyBooks.js
import React from 'react';
import Navbar from '../components/shared/Navbar';

const MyBooks = () => {
  // Dummy data – replace with API calls as needed.
  const borrowedBooks = 3;
  const lateBooks = 1;
  const returnedBooks = 5;
  const allBooks = borrowedBooks + lateBooks + returnedBooks;

  return (
    <div>
      <Navbar />
      <div style={{ padding: '40px' }}>
        <h1>My Books</h1>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '20px'
        }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>Category</th>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>Count</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>Borrowed Books</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{borrowedBooks}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>Late Books</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{lateBooks}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>Returned Books</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{returnedBooks}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>All Books</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{allBooks}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyBooks;
