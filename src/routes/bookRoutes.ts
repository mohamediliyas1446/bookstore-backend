import { Router } from "express";
import { getBooks, getBook, addBook, editBook, removeBook } from "../controllers/bookController";

const router = Router();

router.get("/", getBooks);
router.get("/:id", getBook);
router.post("/", addBook);
router.put("/:id", editBook);
router.delete("/:id", removeBook);

export default router;
