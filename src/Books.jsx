import { useState, useEffect } from "react";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [title, setTitle] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [isbn, setIsbn] = useState("");
  const [selectedBookId, setSelectedBookId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/books")
      .then((res) => res.json())
      .then(setBooks);
    
    fetch("http://localhost:8080/authors")
      .then((res) => res.json())
      .then(setAuthors);
  }, []);

  const refreshAuthors = () => {
    fetch("http://localhost:8080/authors")
      .then((res) => res.json())
      .then(setAuthors);
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/books/addBook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        title, 
        isbn,
        author: { id: parseInt(authorId) } 
      })
    })
      .then((res) => res.json())
      .then((newBook) => {
        console.log("New book received:", newBook);
        setBooks([...books, newBook]);
        setTitle("");
        setAuthorId("");
        setIsbn("");
      })
      .catch((error) => console.error("Error adding book:", error));
  };

  const handleUpdateBook = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8080/books/updateBook/${selectedBookId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        title, 
        isbn,
        author: { id: parseInt(authorId) } 
      })
    })
      .then((res) => res.json())
      .then((updatedBook) => {
        setBooks(books.map((book) => (book.id === selectedBookId ? updatedBook : book)));
        setTitle("");
        setAuthorId("");
        setIsbn("");
        setSelectedBookId(null);
      });
  };

  const handleDeleteBook = (id) => {
    fetch(`http://localhost:8080/books/deleteBook/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        setBooks(books.filter((book) => book.id !== id));
      });
  };

  const handleSelectBook = (book) => {
    setSelectedBookId(book.id);
    setTitle(book.title);
    setIsbn(book.isbn);
    setAuthorId(book.author.id);
  };

  const handleCancel = () => {
    setSelectedBookId(null);
    setTitle("");
    setAuthorId("");
    setIsbn("");
  };

  return (
    <div>
      <h1>Books List</h1>
      <form onSubmit={selectedBookId ? handleUpdateBook : handleAddBook}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <select value={authorId} onChange={(e) => setAuthorId(e.target.value)} onFocus={refreshAuthors} required>
          <option value="">Select Author</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="ISBN"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          required
        />
        <button type="submit">{selectedBookId ? "Update Book" : "Add Book"}</button>
        {selectedBookId && <button type="button" onClick={handleCancel}>Cancel</button>}
      </form>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <strong>{book.title}</strong> by {book.author.name} ({book.isbn})
            <button type="button" onClick={() => handleSelectBook(book)}>
              {selectedBookId === book.id ? "Editing..." : "Edit"}
            </button>
            <button type="button" onClick={() => handleDeleteBook(book.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
