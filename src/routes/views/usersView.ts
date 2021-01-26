import express from 'express'
import usersViewController from '../../controllers/views/usersViewController'

export const usersViewRouter = express.Router()

usersViewRouter.get('/:id', usersViewController.checkUserId, usersViewController.getUserViewById)

usersViewRouter.get('/', usersViewController.getUsersView)
