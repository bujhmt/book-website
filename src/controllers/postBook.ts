import express from 'express'
import path from 'path'
import MediaRepository from '../repositories/mediaRepository'
import Book from '../models/book'
import BookRepository from '../repositories/bookRepository'
import fs from 'fs'

const mediaRepository = new MediaRepository(path.resolve(__dirname + '/../', '../src/data/media'))
const bookDatabase = new BookRepository('./src/data/books.json')

export default {
    async postBook(req: express.Request & { files }, res: express.Response) {
        try {
            if (req.body.title && req.body.author) {
                const newBook: Book = req.body

                if (req.files) {
                    const mim: string = req.files.picture[0].name.split('.')[1]
                    if (mediaRepository.supportedFileFormats.includes(mim)) {
                        fs.writeFileSync(
                            path.join(mediaRepository.path, `${mediaRepository.reserveNextId}.${mim}`),
                            req.files.picture[0].data
                        )
                        newBook.imgUrl = `/api/media/${mediaRepository.currentId}`
                    }
                }
                if (newBook.numOfPages) newBook.numOfPages = Number(newBook.numOfPages)
                else newBook.numOfPages = null
                if (!newBook.imgUrl) newBook.imgUrl = 'null'
                newBook.id = bookDatabase.addBook(newBook)

                res.status(300).redirect(`/views/books/${newBook.id}`)
            } else res.status(400)
        } catch (err) {
            console.log(err.message)
            res.status(500).send({ books: null, message: 'Internal Server Error ' })
        }
    },

    async deleteBook(req: express.Request, res: express.Response) {
        try {
            const remBook: Book = bookDatabase.getBookById(Number(req.params.id))
            bookDatabase.deleteBook(remBook.id)

            res.status(300).redirect('/views/books')
        } catch (err) {
            console.log(err.message)
            res.status(500).send({ books: null, message: 'Internal Server Error ' })
        }
    },
}
