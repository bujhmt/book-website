import express from 'express'
import bcrypt from 'bcryptjs'
import config from 'config'
import path from 'path'
import validator from 'express-validator/check'
import jwt from 'jsonwebtoken'
import userRepository from '../../../repositories/userRepository'
import User from '../../../models/user'

const UserDatabase = new userRepository(path.resolve(__dirname + '../../../../../src/data/users.json'))

export default {
    async signUp(req: express.Request, res: express.Response) {
        try {
            const validationErrors: validator.Result = validator.validationResult(req)

            if (!validationErrors.isEmpty()) {
                return res.status(400).send({
                    errors: validationErrors.array(),
                    message: 'Incorrect user sign up data',
                })
            }

            const newUser: User = req.body

            const candidate = UserDatabase.getUserByLogin(newUser.login)
            if (candidate) {
                return res.status(400).send({ message: 'This user already exists' })
            }

            newUser.password = await bcrypt.hash(newUser.password, 12)

            UserDatabase.addUser(newUser)

            res.status(201).send({ message: 'User has been created' })
        } catch (err) {
            console.log('Auth/signUp Error! ', err.message)
            res.status(500).send({ message: 'Internal server error' })
        }
    },

    async login(req: express.Request, res: express.Response) {
        try {
            const validationErrors: validator.Result = validator.validationResult(req)

            if (!validationErrors.isEmpty()) {
                return res.status(400).send({
                    errors: validationErrors.array(),
                    message: 'Incorrect user login data',
                })
            }

            const newUser: User = req.body

            const user: User = UserDatabase.getUserByLogin(newUser.login)
            if (!user) {
                return res.status(404).send({ message: 'User not found' })
            }

            const isMatch: boolean = await bcrypt.compare(newUser.password, user.password)

            if (!isMatch) {
                return res.status(400).send({ message: 'Incorrect password' })
            }

            const token: string = jwt.sign({ userId: user.id }, config.get('jwtSecret'), {
                expiresIn: '1h',
            })
            
            res.status(200).send({
                token,
                userId: user.id,
            })
        } catch (err) {
            console.log('Auth/login Error! ', err.message)
            res.status(500).send({ message: 'Internal server error' })
        }
    },
}
