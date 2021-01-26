import express from 'express'
import bodyParser from 'body-parser'

import { usersViewRouter } from './usersView'
import { booksViewRouter } from './booksView'
import viewsController from '../../controllers/views/viewsController'

export const viewsRouter = express.Router()

viewsRouter.use(bodyParser.json())
viewsRouter.use(bodyParser.urlencoded({ extended: true }))

//users
viewsRouter.use('/users', usersViewRouter)

//books
viewsRouter.use('/books', booksViewRouter)

//home + about pages
viewsRouter.get('/', viewsController.getHomeView)
viewsRouter.get('/about', viewsController.getAboutView)
