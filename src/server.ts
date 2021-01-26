import express from 'express'
import path from 'path'
import cors from 'cors'
import mustache from 'mustache-express'
import morgan from 'morgan'
import config from 'config'

//routes import
import { apiRouter } from './routes/api/api'
import { viewsRouter } from './routes/views/views'

const app: express.Application = express()

// views
app.engine('mst', mustache(path.resolve(__dirname, '../src/views/partials')))
// set app options
app.set('views', path.resolve(__dirname, '../src/views'))
app.set('view engine', 'mst')

//uses
app.use(cors())
app.use(morgan('dev'))
//routes
app.use('/api', apiRouter)
app.use('/views', viewsRouter)
//public
app.use(express.static(path.resolve(__dirname, '../src/public')))

const port: number = Number(config.get('port')) || 5088

//swagger
const expressSwagger = require('express-swagger-generator')(app)
const options = {
    swaggerDefinition: {
        info: {
            description: 'lab2 http server api',
            title: 'lab2 server',
            version: '1.0.0',
        },
        host: `localhost:${port}`,
        produces: ['application/json'],
    },
    basedir: __dirname,
    files: ['./routes/api/**/*.js', './models/**/*.js'],
}
expressSwagger(options)

//server start
app.listen(port, () => {
    console.log(`Server is listening on port ${port}!`)
})

app.use(function (err, req, res, next) {
    console.log('###############')
    console.log('ERROR')
    console.log(err.message)
    console.log('###############')
    if (err instanceof SyntaxError) {
        res.status(400).send({ message: 'Check your JSON' })
        res.end('')
    } else {
        res.status(500).send({ message: 'Oops, the server got sick' })
        res.end('')
    }
})
