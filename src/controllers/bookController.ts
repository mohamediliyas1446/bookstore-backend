import { Request, Response } from "express";
import { getAllBooks, getBookById, createBook, updateBook, deleteBook } from "../models/bookModel";

export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await getAllBooks();
    res.json(books);
  } catch {
    res.status(500).json({ message: "Error fetching books" });
  }
};

export const getBook = async (req: Request, res: Response) => {
  try {
    const book = await getBookById(Number(req.params.id));
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch {
    res.status(500).json({ message: "Error fetching book" });
  }
};

export const addBook = async (req: Request, res: Response) => {
  try {
    const bookId = await createBook(req.body);
    res.json({ message: "Book added successfully", bookId });
  } catch {
    res.status(500).json({ message: "Error adding book" });
  }
};

export const editBook = async (req: Request, res: Response) => {
  try {
    await updateBook(Number(req.params.id), req.body);
    res.json({ message: "Book updated successfully" });
  } catch {
    res.status(500).json({ message: "Error updating book" });
  }
};

export const removeBook = async (req: Request, res: Response) => {
  try {
    await deleteBook(Number(req.params.id));
    res.json({ message: "Book deleted successfully" });
  } catch {
    res.status(500).json({ message: "Error deleting book" });
  }
};
