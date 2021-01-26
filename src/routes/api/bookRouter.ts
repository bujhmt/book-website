import express from 'express'
import BookController from '../../controllers/api/bookController'
import Book from '../../models/book'

export const BookRouter = express.Router()

/**
 * Get book by id
 * @route GET /api/books/{id}
 * @group Books - book operations
 * @param {integer} id.path.required - id of the Book - eg: 1
 * @returns {Book.model} 200 - Book object
 * @returns {Error} 404 - Book not found
 */
BookRouter.get('/:id', BookController.checkBookId, BookController.getBookById)

/**
 * Delete book by id
 * @route DELETE /api/books/{id}
 * @group Books - book operations
 * @param {integer} id.path.required - id of the Book - eg: 1
 * @returns {Book.model} 200 - Deleted book object
 * @returns {Error} 404 - Book not found
 */
BookRouter.delete('/:id', BookController.checkBookId, BookController.deleteBookById)

/**
 * Post new book
 * @route POST /api/books
 * @group Books - book operations
 * @param {Book.model} id.body.required - new Book object
 * @returns {Book.model} 201 - added Book object
 */
BookRouter.post('/', BookController.checkBookData, BookController.addBook)

/**
 * Update book by id
 * @route PUT /api/books
 * @group Books - book operations
 * @param {Book.model} id.body.required - new Book object
 * @returns {Book.model} 200 - changed Book object
 */
BookRouter.put('/', BookController.checkBookData, BookController.updateBook)

/**
 * Get book array
 * @route GET /api/books
 * @group Books - book operations
 * @param {integer} page.query - page number [default]: 1
 * @param {integer} per_page.query - items per page [default]: 10
 * @returns {Array.<Book>} Book - a page with books
 */
BookRouter.get('/', BookController.getBooks)
