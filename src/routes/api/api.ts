import express from 'express'
import bodyParser from 'body-parser'
import busboyBodyParser from 'busboy-body-parser'

import { UserRouter } from './userRouter'
import { BookRouter } from './bookRouter'
import { MediaRouter } from './mediaRouter'
import AuthRouter from './auth/authRouter'
import post from '../../controllers/postBook'

export const apiRouter = express.Router()

apiRouter.use(bodyParser.json())
apiRouter.use(bodyParser.urlencoded({ extended: true }))

apiRouter.use('/users', UserRouter)

apiRouter.use('/books', BookRouter)

apiRouter.use('/media', MediaRouter)

apiRouter.use('/auth', AuthRouter)

apiRouter.use(
    busboyBodyParser({
        limit: '30mb',
        multi: true,
    })
)

apiRouter.post('/postBook', post.postBook)
apiRouter.post('/deleteBook/:id', post.deleteBook)
