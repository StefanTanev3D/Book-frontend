import { useState, useEffect } from "react";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

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

  return (
    <div>
      <h1>Books List</h1>
      <form onSubmit={handleAddBook}>
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
        <button type="submit">Add Book</button>
      </form>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <strong>{book.title}</strong> by {book.author}
          </li>
        ))}
      </ul>
    </div>
  );
}
