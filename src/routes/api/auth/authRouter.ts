import { Router } from 'express'
import { check } from 'express-validator/check'

import AuthController from '../../../controllers/api/auth/authController'

const AuthRouter: Router = Router()

AuthRouter.post(
    '/signup',
    [
        check('login', 'Incorrect login').isLength({ min: 5, max: 30 }),
        check('password', 'Incorrect password').isLength({ min: 6 }),
    ],
    AuthController.signUp
)

AuthRouter.post(
    '/login',
    [check('login', 'Incorrect login').isLength({ min: 5, max: 30 }), check('password', 'Incorrect password').exists()],
    AuthController.login
)
export default AuthRouter
