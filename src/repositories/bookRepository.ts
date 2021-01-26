import JsonStorage from '../utils/jsonStorage'
import Book from '../models/book'

class BookRepository {
    storage: JsonStorage

    constructor(filePath: string) {
        this.storage = new JsonStorage(filePath)
    }

    getBooks() {
        try {
            return this.storage.readItems()
        } catch (err: any) {
            console.log('BookRepository.ts / getBooks /Error: ', err.message)
        }
    }

    getBookById(bookId: number) {
        try {
            const bookArray: Array<Book> = this.storage.readItems()
            return bookArray.find((item) => item.id === bookId)
        } catch (err: any) {
            console.log('BookRepository.ts / getBookById /Error: ', err.message)
        }
    }

    addBook(bookModel: Book) {
        try {
            const bookArray: Array<Book> = this.storage.readItems()
            bookModel.id = this.storage.nextId
            this.storage.incrementNextId()
            bookArray.push(bookModel)
            this.storage.writeItems(bookArray)
            return bookModel.id
        } catch (err: any) {
            console.log('BookRepository.ts / addBook /Error: ', err.message)
        }
    }

    updateBook(bookModel: Book) {
        try {
            const bookArray: Array<Book> = this.storage.readItems()
            bookArray[bookArray.findIndex((item) => item.id === bookModel.id)] = bookModel
            this.storage.writeItems(bookArray)
        } catch (err: any) {
            console.log('BookRepository.ts / updateBook /Error: ', err.message)
        }
    }

    deleteBook(bookId: number) {
        try {
            const bookArray: Array<Book> = this.storage.readItems()
            const delIndex: number = bookArray.findIndex((item) => item.id === bookId)
            if (delIndex !== -1) bookArray.splice(delIndex, 1)
            this.storage.writeItems(bookArray)
        } catch (err: any) {
            console.log('BookRepository.ts / deleteBook /Error: ', err.message)
        }
    }
}

export default BookRepository
