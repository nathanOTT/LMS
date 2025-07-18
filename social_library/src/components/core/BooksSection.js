import React, { useState, useEffect } from 'react';
import BookCard from '../books/BookCard';
import BorrowBookModal from '../books/BorrowBookModal';
import api from '../../utils/api';
import axios from 'axios';

// Define 5 categories that the user can toggle between.
const categories = ["Fiction", "Mystery", "Science", "History", "Romance"];

const BooksSection = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [books, setBooks] = useState([]);
  const [borrowedIsbns, setBorrowedIsbns] = useState([]); // store borrowed ISBNs here
  const [loading, setLoading] = useState(true);

  // For the Borrow modal
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  // 1. Fetch borrowed ISBNs (no auth needed) + Google Books
  const fetchBorrowedAndBooks = async (category) => {
    try {
      setLoading(true);

      // A) Fetch borrowed ISBNs
      const borrowedResponse = await axios.get('http://localhost:8000/api/books/borrowed-isbns/');
      const borrowed = borrowedResponse.data || [];
      setBorrowedIsbns(borrowed);

      // B) Fetch Google Books for the selected category
      const googleResponse = await api.get('/volumes', {
        params: {
          q: `subject:${category}`,
          maxResults: 15,
        },
      });

      const items = googleResponse.data.items || [];
      setBooks(items);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever the category changes
  useEffect(() => {
    fetchBorrowedAndBooks(selectedCategory);
  }, [selectedCategory]);

  // 2. If user clicks "Borrow," open the modal
  const handleBorrow = (book) => {
    const volumeInfo = book.volumeInfo || {};
    const isbnData = volumeInfo.industryIdentifiers ? volumeInfo.industryIdentifiers[0].identifier : 'N/A';

    console.log('Borrowing book details:');
    console.log('Title:', volumeInfo.title);
    console.log('Author:', volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author');
    console.log('ISBN:', isbnData);
    console.log('Description:', volumeInfo.description || 'No description available.');

    setSelectedBook(book);
    setModalShow(true);
  };

  const handleCloseModal = () => {
    setModalShow(false);
    setSelectedBook(null);
  };

  // 3. Filter out any book whose ISBN is in the borrowedIsbns
  const filteredBooks = books.filter(item => {
    const volumeInfo = item.volumeInfo || {};
    const identifiers = volumeInfo.industryIdentifiers || [];
    if (identifiers.length === 0) return true; // Keep it if no ISBN, or decide to remove
    const googleIsbn = identifiers[0].identifier;
    return !borrowedIsbns.includes(googleIsbn);
  });

  return (
    <section style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Available Books</h2>

      {/* Category Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
        {categories.map((cat, index) => (
          <button
            key={index}
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
        <p style={{ textAlign: 'center' }}>Loading...</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '20px'
        }}>
          {filteredBooks.map(book => {
            const volumeInfo = book.volumeInfo || {};
            const title = volumeInfo.title || 'No Title';
            const authors = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author';
            const image = volumeInfo.imageLinks
              ? (volumeInfo.imageLinks.extraLarge ||
                 volumeInfo.imageLinks.large ||
                 volumeInfo.imageLinks.medium ||
                 volumeInfo.imageLinks.thumbnail)
              : 'https://via.placeholder.com/300';
            const description = volumeInfo.description || 'No description available.';
            const isbn = volumeInfo.industryIdentifiers && volumeInfo.industryIdentifiers.length > 0
              ? volumeInfo.industryIdentifiers[0].identifier
              : 'N/A';

            return (
              <BookCard
                key={book.id}
                title={title}
                author={authors}
                image={image}
                description={description}
                isbn={isbn}
                onView={() => console.log('View book with ISBN:', isbn)}
                onBorrow={() => handleBorrow(book)}
              />
            );
          })}
        </div>
      )}

      {/* Borrow Book Modal */}
      {selectedBook && (
        <BorrowBookModal
          show={modalShow}
          handleClose={handleCloseModal}
          book={selectedBook}
          // If you want to dynamically remove from the front end after borrowing, 
          // you can add a callback or re-fetch the borrowedIsbns after successful borrow
        />
      )}
    </section>
  );
};

export default BooksSection;





