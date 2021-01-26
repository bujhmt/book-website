import express from 'express'
import moment from 'moment'
import path from 'path'
import Book from '../../models/book'
import BookRepository from '../../repositories/bookRepository'
import paginationTools from '../../utils/pagination'

const bookDatabase = new BookRepository(path.resolve(__dirname + '../../../../src/data/books.json'))

export default {
    async checkBookId(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const bookId: number = Number(req.params.id)
            if (!bookDatabase.getBookById(bookId)) {
                res.status(404).send({ book: null, message: 'Not found' })
                return
            }
            await next()
        } catch (err) {
            console.log(err.message)
            res.status(500).send({ book: null, message: 'Internal Server Error ' })
            return
        }
    },

    async checkBookData(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            try {
                const newBook: Book = req.body

                if (newBook.title.length < 2 || newBook.title.length > 50) throw Error('Title length error')

                if (newBook.author.length < 2 || newBook.author.length > 100) throw Error('Author name length error')

                if (!moment(newBook.publicationDate, 'YYYY-MM-DD', true).isValid()) throw Error('Incorrect time format')

                if (newBook.numOfPages) {
                    if (Number(newBook.numOfPages) < 1) throw Error('Incorrect number of pages value')
                } else req.body.numOfPages = 'null'

                if (newBook.rating) {
                    if (Number(newBook.rating) < 1 || Number(newBook.rating) > 10) throw Error('Incorrect rating value')
                } else req.body.rating = 'null'

                if (!newBook.imgUrl) req.body.imgUrl = 'null'
            } catch (error) {
                res.status(400).send({ message: error.message })
                return
            }

            await next()
        } catch (err) {
            console.log(err.message)
            res.status(500).send({ book: null, message: 'Internal Server Error ' })
            return
        }
    },

    async getBooks(req: express.Request, res: express.Response) {
        try {
            let books = bookDatabase.getBooks()
            if (req.query.sub_str)
                books = books.filter((book) => {
                    if (book.title.includes(req.query.sub_str)) return true
                    return false
                })
            const count = books.length
            const bookArray: Array<Book> = paginationTools.getResPageItems(req.query.page, req.query.per_page, books)

            res.status(200).send({ books: bookArray, count, maxPage: Math.ceil(count / bookArray.length) })
        } catch (err) {
            console.log(err.message)
            res.status(500).send({ books: null, message: 'Internal Server Error ' })
        }
    },

    async getBookById(req: express.Request, res: express.Response) {
        try {
            const book: Book = bookDatabase.getBookById(Number(req.params.id))
            res.status(200).send({ book: book })
        } catch (err) {
            console.log(err.message)
            res.status(500).send({ books: null, message: 'Internal Server Error ' })
        }
    },

    async deleteBookById(req: express.Request, res: express.Response) {
        try {
            const remBook: Book = bookDatabase.getBookById(Number(req.params.id))
            bookDatabase.deleteBook(remBook.id)

            res.status(200).send({ book: remBook, message: 'Book has been deleted' })
        } catch (err) {
            console.log(err.message)
            res.status(500).send({ books: null, message: 'Internal Server Error ' })
        }
    },

    async addBook(req: express.Request, res: express.Response) {
        try {
            const newBook: Book = req.body
            newBook.rating = Number(newBook.rating)
            newBook.numOfPages = Number(newBook.numOfPages)
            newBook.id = bookDatabase.addBook(newBook)
            res.status(201).send({ book: newBook, message: 'Book has been created' })
        } catch (err) {
            console.log(err.message)
            res.status(500).send({ books: null, message: 'Internal Server Error ' })
        }
    },

    async updateBook(req: express.Request, res: express.Response) {
        try {
            const newBook: Book = req.body

            newBook.rating = Number(newBook.rating)
            newBook.numOfPages = Number(newBook.numOfPages)
            newBook.id = Number(newBook.id)

            if (bookDatabase.getBookById(newBook.id)) {
                bookDatabase.updateBook(newBook)
                res.status(200).send({ book: newBook, message: 'Book has been updated' })
            } else res.status(404).send({ book: null, message: 'Not found' })
        } catch (err) {
            console.log(err.message)
            res.status(500).send({ books: null, message: 'Internal Server Error ' })
        }
    },
}
