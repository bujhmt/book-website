import express from 'express'
import path from 'path'
import User from '../../models/user'
import UserRepository from '../../repositories/userRepository'
import paginationTools from '../../utils/pagination'

const UserDatabase = new UserRepository('./src/data/users.json')

export default {
    async checkUserId(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const userId: number = Number(req.params.id)
            if (!UserDatabase.getUserById(userId)) {
                res.status(404).render(path.resolve(__dirname, '../../../src/views/error.mst'), {
                    code: 404,
                    message: `User with id ${userId} not found`,
                })
                return
            }
            await next()
        } catch (err) {
            console.log(err.message)
            res.status(500).send({ user: null, message: 'Internal Server Error ' })
            return
        }
    },

    async getUserViewById(req: express.Request, res: express.Response) {
        try {
            const user: User = UserDatabase.getUserById(Number(req.params.id))
            if (user.avaUrl === 'null') user.avaUrl = '/images/nullAvatar.jpg'
            res.status(200).render(path.resolve(__dirname, '../../../src/views/user.mst'), user)
        } catch (err) {
            console.log(err.message)
            res.status(500).send({ users: null, message: 'Internal Server Error ' })
        }
    },

    async getUsersView(req: express.Request, res: express.Response) {
        try {
            let page: number = Number(req.query.page)
            let per_page: number = Number(req.query.per_page)

            const allUsers: Array<User> = UserDatabase.getUsers()
            if (isNaN(page) || page < 1) page = 1
            if (isNaN(per_page) || per_page < 1) per_page = 10

            const allPages = Math.ceil(allUsers.length / per_page)
            if (page > allPages) page--

            const users: Array<User> = paginationTools.getResPageItems(page, per_page, allUsers)

            users.forEach((user) => {
                if (user.avaUrl === 'null') user.avaUrl = '/images/nullAvatar.jpg'
            })

            res.status(200).render(path.resolve(__dirname, '../../../src/views/users.mst'), {
                current: String(page) + '/' + String(allPages),
                page,
                per_page,
                users,
                next: `users?page=${page + 1}&per_page=${per_page}`,
                prev: `users?page=${page - 1}&per_page=${per_page}`,
            })
        } catch (err) {
            console.log(err.message)
            res.status(500).send({ users: null, message: 'Internal Server Error ' })
        }
    },
}
