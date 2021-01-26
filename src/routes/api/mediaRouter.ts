import express from 'express'
import MediaController from '../../controllers/api/mediaController'

export const MediaRouter = express.Router()

/**
 * Get media by id
 * @route GET /api/media/{id}
 * @group Media - upload and get images
 * @param {integer} id.path.required - id of the media - eg: 1
 * @returns {file} 200 - Media object
 * @returns {Error} 404 - Media not found
 */
MediaRouter.get('/:id', MediaController.sendMediaById)

/**
 * Upload new image
 * @route POST /api/media
 * @group Media - upload and get images
 * @consumes multipart/form-data
 * @param {file} image.formData.required - uploaded image
 * @returns {integer} 201 - added image id
 */
MediaRouter.post('/', MediaController.saveMedia)
