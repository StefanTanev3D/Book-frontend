import { useState, useEffect } from "react";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [selectedBookId, setSelectedBookId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/books")
      .then((res) => res.json())
      .then(setBooks);
  }, []);

  const handleAddBook = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/books/addBook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, author })
    })
      .then((res) => res.json())
      .then((newBook) => {
        setBooks([...books, newBook]);
        setTitle("");
        setAuthor("");
      });
  };

  const handleUpdateBook = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8080/books/updateBook/${selectedBookId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, author })
    })
      .then((res) => res.json())
      .then((updatedBook) => {
        setBooks(books.map((book) => (book.id === selectedBookId ? updatedBook : book)));
        setTitle("");
        setAuthor("");
        setSelectedBookId(null);
      })
  };

  const handleDeleteBook = (id) => {
    fetch(`http://localhost:8080/books/deleteBook/${id}`, {
      method: "DELETE"
    })
    .then(() => {
      setBooks(books.filter((book) => book.id !== id));
    });
  }

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
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <button type="submit">{selectedBookId ? "Update Book" : "Add Book"}</button>
      </form>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <strong>{book.title}</strong> by {book.author}
            <button type="button" onClick={() => setSelectedBookId(selectedBookId == book.id ? null : book.id)}>Update</button>
            <button type="button" onClick={() => handleDeleteBook(book.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
