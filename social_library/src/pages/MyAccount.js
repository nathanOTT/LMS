import React, { useState, useEffect } from 'react';
import Navbar from '../components/shared/Navbar';
import axios from 'axios';

const categories = ["Borrowed", "Late", "Returned", "All"];

const MyAccount = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Borrowed");

  useEffect(() => {
    // Only fetch if user is logged in
    if (!user) {
      setLoading(false);
      return;
    }
    fetchMyBooks();
    // Using an empty dependency array ensures this runs only once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch all borrowed transactions for the current user (once).
  const fetchMyBooks = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found; user may not be logged in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:8000/api/books/mybooks/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setBooks(response.data || []);
    } catch (error) {
      console.error("Error fetching user's books:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (transactionId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Not authenticated! Please log in.");
      return;
    }

    try {
      await axios.patch(`http://localhost:8000/api/books/mybooks/${transactionId}/return`, null, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setBooks(prev =>
        prev.map(book => 
          book.id === transactionId ? { ...book, returned: true } : book
        )
      );
    } catch (error) {
      console.error("Error returning book:", error.response?.data || error);
      alert("Failed to return the book.");
    }
  };

  const categorizeBook = (book) => {
    if (book.returned) return "Returned";
    const today = new Date();
    const retDate = new Date(book.return_date);
    return retDate < today ? "Late" : "Borrowed";
  };

  const filteredBooks = books.filter((book) => {
    const cat = categorizeBook(book);
    if (selectedCategory === "All") return true;
    return cat === selectedCategory;
  });

  const getDaysDifference = (returnDateString, isLate) => {
    const today = new Date();
    const rDate = new Date(returnDateString);
    let diff = Math.ceil((rDate - today) / (1000 * 60 * 60 * 24));
    if (isLate) {
      diff = Math.abs(diff);
    }
    return diff;
  };

  if (!user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Please log in to view your account details.</h2>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={{ padding: '40px' }}>
        {/* User info */}
        <h1>Welcome, {user.first_name} {user.last_name}!</h1>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        {user.genres && user.genres.length > 0 && (
          <p>
            <strong>Preferred Genres:</strong> {user.genres.join(', ')}
          </p>
        )}

        <hr style={{ margin: '30px 0' }} />

        <h2>My Books</h2>
        {/* Category Buttons */}
        <div style={{ marginBottom: '20px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '10px 15px',
                margin: '5px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedCategory === cat ? '#007bff' : '#ccc',
                color: selectedCategory === cat ? '#fff' : '#333',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <p>Loading your books...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Author</th>
                <th style={thStyle}>Return Date</th>
                {selectedCategory === "Borrowed" && <th style={thStyle}>Days Remaining</th>}
                {selectedCategory === "Late" && <th style={thStyle}>Days Late</th>}
                {selectedCategory === "Returned" && <th style={thStyle}>Date Returned</th>}
                {selectedCategory === "All" && <th style={thStyle}>Status</th>}
                {(selectedCategory === "Borrowed" || selectedCategory === "Late") && (
                  <th style={thStyle}>Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => {
                const cat = categorizeBook(book);
                const isLate = (cat === "Late");
                const isReturned = (cat === "Returned");

                return (
                  <tr key={book.id}>
                    <td style={tdStyle}>{book.title}</td>
                    <td style={tdStyle}>{book.author}</td>
                    <td style={tdStyle}>{new Date(book.return_date).toLocaleDateString()}</td>
                    {selectedCategory === "Borrowed" && (
                      <td style={tdStyle}>{getDaysDifference(book.return_date, false)}</td>
                    )}
                    {selectedCategory === "Late" && (
                      <td style={tdStyle}>{getDaysDifference(book.return_date, true)}</td>
                    )}
                    {selectedCategory === "Returned" && (
                      <td style={tdStyle}>
                        Returned on {new Date(book.return_date).toLocaleDateString()}
                      </td>
                    )}
                    {selectedCategory === "All" && (
                      <td style={tdStyle}>{cat}</td>
                    )}
                    {(selectedCategory === "Borrowed" || selectedCategory === "Late") && (
                      <td style={tdStyle}>
                        <button
                          style={{
                            padding: '6px 10px',
                            backgroundColor: '#dc3545',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleReturnBook(book.id)}
                        >
                          Return
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// Simple table styles
const thStyle = {
  border: '1px solid #ccc',
  padding: '10px',
  textAlign: 'left',
};

const tdStyle = {
  border: '1px solid #ccc',
  padding: '10px',
};

export default MyAccount;


