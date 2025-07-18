import React, { useState } from 'react';
import axios from 'axios';

const BorrowBookModal = ({ show, handleClose, book, onSuccessfulBorrow }) => {
  // 1. Always call Hooks at the top level
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Then do condition checks
  if (!book) {
    return null;
  }

  const volumeInfo = book.volumeInfo || {};
  const title = volumeInfo.title || "No Title Available";
  const author = volumeInfo.authors ? volumeInfo.authors.join(", ") : "Unknown Author";
  const isbn = volumeInfo.industryIdentifiers
    ? volumeInfo.industryIdentifiers[0].identifier
    : "N/A";
  const description = volumeInfo.description || "No description available.";

  const truncateDescription = (desc) => {
    const words = desc.split(' ');
    if (words.length > 10) {
      return words.slice(0, 10).join(' ') + '...';
    }
    return desc;
  };

  const handleBorrowClick = async () => {
    // Prevent multiple submissions
    if (isSubmitting) return;

    setIsSubmitting(true);

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Not authenticated! Please log in.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/books/borrow/",
        {
          isbn,
          title,
          author,
          summary: description,
        },
        {
          headers: {
            Authorization: `Token ${token}`, // or 'Bearer' for JWT
          },
        }
      );

      console.log("Borrow success:", response.data);

      if (onSuccessfulBorrow) {
        onSuccessfulBorrow();
      }

      handleClose();
    } catch (error) {
      console.error("Borrow error:", error.response?.data || error);
      alert("Failed to borrow the book. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        display: show ? "block" : "none",
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        zIndex: 1000,
        maxWidth: "500px",
        width: "100%",
      }}
    >
      <h2>Borrow Book</h2>
      <p><strong>Title:</strong> {title}</p>
      <p><strong>Author:</strong> {author}</p>
      <p><strong>ISBN:</strong> {isbn}</p>
      <p><strong>Summary:</strong> {truncateDescription(description)}</p>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            fontSize: "1rem",
            marginRight: "10px",
            opacity: isSubmitting ? 0.7 : 1,
          }}
          onClick={handleBorrowClick}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Borrowing..." : "Confirm Borrow"}
        </button>
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#ccc",
            color: "#000",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
          onClick={handleClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BorrowBookModal;



