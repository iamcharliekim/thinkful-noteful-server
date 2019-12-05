require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const helmet = require ('helmet')

const { NODE_ENV } = require('./config')

const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common'

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use((req, res, next)=> {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization').split(' ')[1]

    if (!authToken || apiToken !== authToken){
        logger.error(`Unauthorized Request to path ${req.path}`)
        return res.status(401).json({error: 'Unauthorized Request'})
    }
    next()
})

const notesRouter = require('./notes/notes-router')
const foldersRouter = require('./folders/folders-router')

app.use('/api',notesRouter)

app.use('/api', foldersRouter)

app.get('/', (req, res)=> {
    res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next){
    let response
    if (NODE_ENV === 'production'){
        response = { error: { message: 'server error' } }
    } else {
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app 