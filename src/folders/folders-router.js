const express = require('express')
const xss = require('xss')
const path = require('path')
const FoldersService = require('./folders-service')

const foldersRouter = express.Router()
const jsonParser = express.json()

const serializeFolders = (folders) => 
     folders.map((folder)=> {
        return {
            id: folder.id,
            name: xss(folder.name)
        }
    })


foldersRouter
    .route('/folders')
    .get((req, res, next)=> {
        const knex = req.app.get('db')

        FoldersService.getAllFolders(knex)
            .then((folders)=> {
                res.json(serializeFolders(folders))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next,)=> {
        const knex = req.app.get('db')
        const newFolder = {name: req.body.name}

        FoldersService.insertFolder(knex, newFolder)
            .then((response)=> {
                res.status(201)
                    .location(path.posix.join(req.originalUrl, `/${response.id}`))
                    .json({
                        id: response.id,
                        name: xss(response.name)
                    })
            })
            .catch(next)
    })


foldersRouter
    .route('/folders/:id')
    .get((req, res, next)=> {
        const knex = req.app.get('db')
        const id = req.params.id

        FoldersService.getFolderById(knex, id)
            .then((folder)=> {
                res.json({
                    id: folder.id,
                    name: xss(folder.name)
                })
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next)=> {
        const knex = req.app.get('db')
        const id = req.params.id
        const udpatedFolder = { name: req.body.name}

        FoldersService.updateFolder(knex, id, udpatedFolder)
            .then((response)=> {
                res.status(204).end()
            })
            .catch(next)
    })
    .delete((req, res, next)=> {
        const knex = req.app.get('db')
        const id = req.params.id

        FoldersService.deleteFolder(knex, id)
            .then(()=> res.status(204).end())
            .catch(next)
    })

module.exports = foldersRouter