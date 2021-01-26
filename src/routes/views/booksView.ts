import express from 'express'
import booksViewController from '../../controllers/views/booksViewController'

export const booksViewRouter = express.Router()

booksViewRouter.get('/new', booksViewController.getNewBookView)

booksViewRouter.get('/:id', booksViewController.checkBookId, booksViewController.getBookViewById)

booksViewRouter.get('/', booksViewController.getBooksView)
