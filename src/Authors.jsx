import { useState, useEffect } from "react";

export default function Authors() {
  const [authors, setAuthors] = useState([]);
  const [name, setName] = useState("");
  const [selectedAuthorId, setSelectedAuthorId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/authors")
      .then((res) => res.json())
      .then(setAuthors);
  }, []);

  const handleAddAuthor = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/authors/addAuthor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    })
      .then((res) => res.json())
      .then((newAuthor) => {
        setAuthors([...authors, newAuthor]);
        setName("");
      });
  };

  const handleUpdateAuthor = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8080/authors/updateAuthor/${selectedAuthorId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    })
      .then((res) => res.json())
      .then((updatedAuthor) => {
        setAuthors(authors.map((author) => (author.id === selectedAuthorId ? updatedAuthor : author)));
        setName("");
        setSelectedAuthorId(null);
      });
  };

  const handleDeleteAuthor = (id) => {
    fetch(`http://localhost:8080/authors/deleteAuthor/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        setAuthors(authors.filter((author) => author.id !== id));
      });
  };

  const handleSelectAuthor = (id) => {
    const author = authors.find((a) => a.id === id);
    if (author) {
      setSelectedAuthorId(id);
      setName(author.name);
    }
  };

  const handleCancel = () => {
    setSelectedAuthorId(null);
    setName("");
  };

  return (
    <div>
      <h1>Authors</h1>
      <form onSubmit={selectedAuthorId ? handleUpdateAuthor : handleAddAuthor}>
        <input
          type="text"
          placeholder="Author Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">{selectedAuthorId ? "Update Author" : "Add Author"}</button>
        {selectedAuthorId && <button type="button" onClick={handleCancel}>Cancel</button>}
      </form>
      <ul>
        {authors.map((author) => (
          <li key={author.id}>
            <strong>{author.name}</strong>
            <button type="button" onClick={() => handleSelectAuthor(author.id)}>
              {selectedAuthorId === author.id ? "Editing..." : "Edit"}
            </button>
            <button type="button" onClick={() => handleDeleteAuthor(author.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
