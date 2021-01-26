import express from 'express'
import path from 'path'
import multer, { Multer } from 'multer'
import MediaRepository from '../../repositories/mediaRepository'

const mediaRepository = new MediaRepository(path.resolve(__dirname + '/../', '../../src/data/media'))

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, mediaRepository.path)
        },
        filename: (req, file, cb) => {
            const fileFormat = file.mimetype.split('/')[1]
            cb(null, `${String(mediaRepository.reserveNextId)}.${fileFormat}`)
        },
    }),

    fileFilter: (req, file, cb) => {
        const fileFormat: string = file.mimetype.split('/')[1]
        if (mediaRepository.supportedFileFormats.includes(fileFormat)) {
            cb(null, true)
        } else {
            cb(null, false)
        }
    },
    limits: {
        fileSize: 52428800,
        fieldSize: 52428800,
    },
}).any()

export default {
    async sendMediaById(req: express.Request, res: express.Response) {
        try {
            const mediaId: number = Number(req.params.id)
            const path: any = mediaRepository.checkMediaExists(mediaId)

            if (path) res.sendFile(path)
            else res.status(404).send({ media: null, message: 'Not found' })
        } catch (err) {
            console.log(err.message)
            res.status(500).send({ media: null, message: 'Internal Server Error ' })
        }
    },

    async saveMedia(req: express.Request, res: express.Response) {
        try {
            upload(req, res, (err) => {
                if (err) {
                    console.log('err ', err.message)
                    res.status(500).send({ media: null, message: 'Internal Server Error ' })
                    return
                } else if (req.files) {
                    res.status(201).send({ mediaId: mediaRepository.currentId, message: 'Media has been uploaded' })
                } else {
                    res.status(400).send({ message: 'Bad request' })
                }
            })
        } catch (err) {
            console.log(err.message)
            res.status(500).send({ media: null, message: 'Internal Server Error ' })
        }
    },
}
