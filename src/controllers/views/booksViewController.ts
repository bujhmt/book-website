import express from 'express'
import path from 'path'
import fs from 'fs'
import mustache from 'mustache'
import Book from '../../models/book'
import BookRepository from '../../repositories/bookRepository'
import paginationTools from '../../utils/pagination'

const bookDatabase = new BookRepository('./src/data/books.json')

export default {
    async checkBookId(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const bookId: number = Number(req.params.id)
            if (!bookDatabase.getBookById(bookId)) {
                res.status(404).render(path.resolve(__dirname, '../../../src/views/error.mst'), {
                    code: 404,
                    message: `Book with id ${bookId} not found`,
                })
                return
            }
            await next()
        } catch (err) {
            console.log(err.message)
            res.status(500).send({ book: null, message: 'Internal Server Error ' })
            return
        }
    },

    async getBookViewById(req: express.Request, res: express.Response) {
        try {
            const book: Book = bookDatabase.getBookById(Number(req.params.id))
            if (book.imgUrl === 'null') book.imgUrl = '/images/empty.jpg'
            res.status(200).render(path.resolve(__dirname, '../../../src/views/book.mst'), book)
        } catch (err) {
            console.log(err.message)
            res.status(500).send({ books: null, message: 'Internal Server Error ' })
        }
    },

    async getBooksView(req: express.Request, res: express.Response) {
        try {
            let page: number = Number(req.query.page)
            let per_page: number = Number(req.query.per_page)
            let old_value: string = ''
            let current: string = ''
            let warning: string = ''

            let allBooks: Array<Book> = bookDatabase.getBooks()
            if (isNaN(page) || page < 1) page = 1
            if (isNaN(per_page) || per_page < 1) per_page = 10

            if (req.query.searchStr) {
                old_value = String(req.query.searchStr).toLowerCase().trim()
                allBooks = allBooks.filter((book) => book.title.toLowerCase().trim().includes(old_value))
            }

            const allPages = Math.ceil(allBooks.length / per_page)
            if (page > allPages) page--

            const books: Array<Book> = paginationTools.getResPageItems(page, per_page, allBooks)

            books.forEach((book) => {
                if (book.imgUrl === 'null') book.imgUrl = '/images/empty.jpg'
            })
            if (books.length > 0) current = 'Page:' + String(page) + '/' + String(allPages)
            else {
                const warningTemplate: string = fs
                    .readFileSync(path.resolve(__dirname, '../../../src/content/warning.mst'))
                    .toString()
                const warningMsg: string = 'There are no books with the title of "' + old_value + '"'
                warning = mustache.render(warningTemplate, { warningMsg })
            }

            res.status(200).render(path.resolve(__dirname, '../../../src/views/books.mst'), {
                current,
                page,
                per_page,
                books,
                old_value,
                next: `books?page=${page + 1}&per_page=${per_page}&searchStr=${old_value}`,
                prev: `books?page=${page - 1}&per_page=${per_page}&searchStr=${old_value}`,
                warning,
            })
        } catch (err) {
            console.log(err.message)
            res.status(500).send({ books: null, message: 'Internal Server Error ' })
        }
    },

    async getNewBookView(req: express.Request, res: express.Response) {
        try {
            res.status(200).render('postBook')
        } catch (err) {
            console.log(err.message)
            res.status(500).send({ books: null, message: 'Internal Server Error ' })
        }
    },
}
