/**
 * @typedef Book
 * @property {integer} id
 * @property {string} title.required - title of the book
 * @property {string} author.required - author fullname
 * @property {number} numOfPages - number of book pages  [default]: -1 == null
 * @property {string} publicationDate.required - publiction date in ISO format(YYYY-MM-DD)
 * @property {number} rating - your book rating (1 - 10) [default]: -1 == null
 * @property {string} imgUrl - url to book img
 */

class Book {
    id: number
    title: string
    author: string
    numOfPages: number
    rating: number
    publicationDate: string
    imgUrl: string
}

export default Book
