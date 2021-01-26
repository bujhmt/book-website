import express from 'express'
import userController from '../../controllers/api/userController'

export const UserRouter = express.Router()

/**
 * Get user by id
 * @route GET /api/users/{id}
 * @group Users - user operations
 * @param {integer} id.path.required - id of the User - eg: 1
 * @returns {User.model} 200 - User object
 * @returns {Error} 404 - User not found
 */
UserRouter.get('/:id', userController.checkUserId, userController.getUserById)

/**
 * Delete user by id
 * @route DELETE /api/users/{id}
 * @group Users - user operations
 * @param {integer} id.path.required - id of the User - eg: 1
 * @returns {User.model} 200 - deleted User object
 * @returns {Error} 404 - User not found
 */
UserRouter.delete('/:id', userController.checkUserId, userController.deleteUserById)

/**
 * Add new User
 * @route POST /api/users
 * @group Users - user operations
 * @param {User.model} id.body.required - new User object
 * @returns {User.model} 201 - added User object
 */
UserRouter.post('/', userController.checkUserData, userController.addUser)

/**
 * Update user
 * @route PUT /api/users
 * @group Users - user operations
 * @param {User.model} id.body.required - new User object
 * @returns {User.model} 200 - changed User object
 */
UserRouter.put('/', userController.checkUserData, userController.updateUser)

/**
 * Get user array
 * @route GET /api/users
 * @group Users - user operations
 * @param {integer} page.query - page number [default]: 1
 * @param {integer} per_page.query - items per page [default]: 10
 * @returns {Array.<User>} User - a page with users
 */
UserRouter.get('/', userController.getUsers)
