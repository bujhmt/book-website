import express from 'express'
import moment from 'moment'
import path from 'path'
import User from '../../models/user'
import UserRepository from '../../repositories/userRepository'
import paginationTools from '../../utils/pagination'

const UserDatabase = new UserRepository(path.resolve(__dirname + '../../../../src/data/users.json'))

export default {
    async checkUserId(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const userId: number = Number(req.params.id)
            if (!UserDatabase.getUserById(userId)) {
                res.status(404).send({ user: null, message: 'Not found' })
                return
            }
            await next()
        } catch (err) {
            console.log(err.message)
            res.status(500).send({ user: null, message: 'Internal Server Error ' })
            return
        }
    },

    async checkUserData(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            try {
                const newUser: User = req.body

                if (newUser.login.length < 2 || newUser.login.length > 50) throw Error('Login length error')

                if (newUser.fullname.length < 2 || newUser.fullname.length > 100) throw Error('Fullname length error')

                if (newUser.role) {
                    if (newUser.role != 0 && newUser.role != 1) throw Error('Incorrect role code')
                } else req.body.role = 0

                if (newUser.registeredAt) {
                    if (!moment(newUser.registeredAt, 'YYYY-MM-DDTHH:mm', true).isValid())
                        throw Error('Incorrect time format')
                } else req.body.registeredAt = new Date().toISOString()

                if (newUser.avaUrl) {
                    if (newUser.avaUrl.length < 2 || newUser.avaUrl.length > 100) throw Error('AvaUrl length error')
                } else req.body.avaUrl = 'null'

                if (newUser.isEnabled === undefined) req.body.isEnabled = true
            } catch (error) {
                res.status(400).send({ message: error.message })
                return
            }

            await next()
        } catch (err) {
            console.log(err.message)
            res.status(500).send({ user: null, message: 'Internal Server Error ' })
            return
        }
    },

    async getUsers(req: express.Request, res: express.Response) {
        try {
            const userArray: Array<User> = paginationTools.getResPageItems(
                req.query.page,
                req.query.per_page,
                UserDatabase.getUsers()
            )
            res.status(200).send({ users: userArray })
        } catch (err) {
            console.log(err.message)
            res.status(500).send({ users: null, message: 'Internal Server Error ' })
        }
    },

    async getUserById(req: express.Request, res: express.Response) {
        try {
            const user: User = UserDatabase.getUserById(Number(req.params.id))
            user.password = ''
            res.status(200).send({ user: user })
        } catch (err) {
            console.log(err.message)
            res.status(500).send({ users: null, message: 'Internal Server Error ' })
        }
    },

    async deleteUserById(req: express.Request, res: express.Response) {
        try {
            const remUser: User = UserDatabase.getUserById(Number(req.params.id))
            UserDatabase.deleteUser(remUser.id)
            res.status(200).send({ user: remUser, message: 'User has been deleted' })
        } catch (err) {
            console.log(err.message)
            res.status(500).send({ users: null, message: 'Internal Server Error ' })
        }
    },

    async addUser(req: express.Request, res: express.Response) {
        try {
            const newUser: User = req.body
            newUser.role = Number(newUser.role)
            newUser.isEnabled = Boolean(newUser.isEnabled)
            if (!newUser.avaUrl) newUser.avaUrl = 'null'
            newUser.id = UserDatabase.addUser(newUser)
            res.status(201).send({ user: newUser, message: 'User has been created' })
        } catch (err) {
            console.log(err.message)
            res.status(500).send({ users: null, message: 'Internal Server Error ' })
        }
    },

    async updateUser(req: express.Request, res: express.Response) {
        try {
            const newUser: User = req.body

            newUser.role = Number(newUser.role)
            newUser.isEnabled = Boolean(newUser.isEnabled)
            newUser.id = Number(newUser.id)

            if (UserDatabase.getUserById(newUser.id)) {
                UserDatabase.updateUser(newUser)
                res.status(200).send({ user: newUser, message: 'User has been updated' })
            } else res.status(404).send({ user: null, message: 'Not found' })
        } catch (err) {
            console.log(err.message)
            res.status(500).send({ users: null, message: 'Internal Server Error ' })
        }
    },
}
