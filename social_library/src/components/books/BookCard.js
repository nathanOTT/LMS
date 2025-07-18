import React from 'react';

const cardStyle = {
  border: '1px solid #ddd',
  padding: '15px',
  borderRadius: '8px',
  backgroundColor: '#fff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
};

const imageStyle = {
  width: '100%',
  height: '300px',
  objectFit: 'cover',
  borderRadius: '5px',
};

const titleStyle = {
  fontSize: '1.5em',
  fontWeight: 'bold',
  textAlign: 'center',
  margin: '10px 0'
};

const textStyle = {
  margin: '8px 0',
  textAlign: 'left'
};

const buttonContainerStyle = {
  marginTop: '10px',
  textAlign: 'center',
};

const buttonStyle = {
  padding: '8px 12px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  margin: '5px',
  fontWeight: 'bold',
  fontSize: '1rem',
  transition: 'background-color 0.3s ease',
};

const viewButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#007bff',
  color: '#fff',
};

const borrowButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#28a745',
  color: '#fff',
};

const BookCard = ({ title, author, image, description, isbn, onView, onBorrow }) => {
  // Function to truncate description to up to 150 words
  const getTruncatedDescription = (desc) => {
    if (!desc) return "No description available.";
    const words = desc.split(' ');
    if (words.length > 20) {
      return words.slice(0, 20).join(' ') + '...';
    }
    return desc;
  };

  return (
    <div style={cardStyle}>
      <img src={image} alt={title} style={imageStyle} />
      <div>
        <div style={titleStyle}>{title}</div>
        <p style={textStyle}><strong>Author:</strong> {author}</p>
        <p style={textStyle}>
          <strong>Summary:</strong> {getTruncatedDescription(description)}
        </p>
        <p style={textStyle}><strong>ISBN:</strong> {isbn}</p>
      </div>
      <div style={buttonContainerStyle}>
        <button 
          style={viewButtonStyle} 
          onClick={() => onView(isbn)} // Trigger the view action
        >
          View
        </button>
        <button 
          style={borrowButtonStyle} 
          onClick={() => onBorrow(isbn)} // Trigger the borrow action
        >
          Borrow
        </button>
      </div>
    </div>
  );
};

export default BookCard;


