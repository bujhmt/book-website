import express from 'express'
import path from 'path'
import fs from 'fs'

export default {
    async getHomeView(req: express.Request, res: express.Response) {
        try {
            fs.readFile(path.resolve(__dirname, './../../../src/content/homePage.html'), (err, content_html) => {
                if (err)
                    res.status(500).render(path.resolve(__dirname, './../../../src/views/error.mst'), {
                        code: 500,
                        message: 'Oops...',
                    })
                else
                    res.status(200).render(path.resolve(__dirname, './../../../src/views/index.mst'), {
                        content_html,
                    })
            })
        } catch (err) {
            console.log(err.message)
            res.status(500).send({ users: null, message: 'Internal Server Error ' })
        }
    },

    async getAboutView(req: express.Request, res: express.Response) {
        try {
            fs.readFile(path.resolve(__dirname, './../../../src/content/aboutPage.html'), (err, content_html) => {
                if (err)
                    res.status(500).render(path.resolve(__dirname, './../../../src/views/error.mst'), {
                        code: 500,
                        message: 'Oops...',
                    })
                else
                    res.status(200).render(path.resolve(__dirname, './../../../src/views/index.mst'), {
                        content_html,
                    })
            })
        } catch (err) {
            console.log(err.message)
            res.status(500).send({ users: null, message: 'Internal Server Error ' })
        }
    },
}
