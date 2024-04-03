import express, { Request, Response } from 'express';
import { BookService } from '../services/BookService';

const bookRoutes = express.Router();

// Rota para listar todos os livros (GET /books)
bookRoutes.get('/', async (req: Request, res: Response) => {
    const books = await BookService.readAll();
    res.json(books);
});

// Rota para obter um livro por ID (GET /books/:id)
bookRoutes.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const book = await BookService.readById(parseInt(id));
        if (book) {
            res.json(book);
        } else {
            res.status(404).json({ message: 'Livro não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar livro', error });
    }
});

// Rota para adicionar um novo livro (POST /books)
bookRoutes.post('/', async (req: Request, res: Response) => {
    const { title, author, year } = req.body;

    if (!title || !author || !year) {
        return res.status(400).json({ message: 'Todos os campos (título, autor e ano) são obrigatórios' });
    }

    try {
        const newBook = await BookService.createBook(title, author, year);
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar livro', error });
    }
});

// Rota para atualizar um livro por ID (PUT /books/:id)
bookRoutes.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, author, year } = req.body;

    try {
        const updatedBook = await BookService.updateBook(parseInt(id), title, author, year);
        if (updatedBook) {
            res.json(updatedBook);
        } else {
            res.status(404).json({ message: 'Livro não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar livro', error });
    }
});

// Rota para excluir um livro por ID (DELETE /books/:id)
bookRoutes.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await BookService.deleteBook(parseInt(id));
        res.json({ message: 'Livro excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir livro', error });
    }
});

export default bookRoutes;
