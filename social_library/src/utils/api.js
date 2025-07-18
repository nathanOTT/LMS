import axios from 'axios';

const api = axios.create({
  baseURL: 'https://www.googleapis.com/books/v1', // Google Books API base URL
});

export default api;
