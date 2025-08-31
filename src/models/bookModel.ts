import db from "../config/db";

export const getAllBooks = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM books", (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

export const getBookById = (id: number) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM books WHERE id = ?", [id], (err, results) => {
      if (err) return reject(err);
      resolve((results as any[])[0]);
    });
  });
};

export const createBook = (book: any) => {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO books (title, author, price, description, cover_image) VALUES (?, ?, ?, ?, ?)",
      [book.title, book.author, book.price, book.description || "", book.cover_image || ""],
      (err, result: import("mysql2").ResultSetHeader) => {
        if (err) return reject(err);
        resolve(result.insertId);
      }
    );
  });
};

export const updateBook = (id: number, book: any) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE books SET title=?, author=?, price=?, description=?, cover_image=? WHERE id=?",
      [book.title, book.author, book.price, book.description || "", book.cover_image || "", id],
      (err) => {
        if (err) return reject(err);
        resolve(true);
      }
    );
  });
};

export const deleteBook = (id: number) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM books WHERE id=?", [id], (err) => {
      if (err) return reject(err);
      resolve(true);
    });
  });
};
