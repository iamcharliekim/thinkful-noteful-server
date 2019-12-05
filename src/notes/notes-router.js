const express = require('express')
const xss = require('xss')
const path = require('path')
const NotesService = require('./notes-service')
const notesRouter = express.Router()
const jsonParser = express.json()

const serializeNotes = (notes) => 
    notes.map((note)=> {
        return {
            id: note.id,
            name: xss(note.name),
            modified: note.modified,
            folder_id: note.folder_id,
            content: xss(note.content)
        }
    })

notesRouter
    .route('/notes')
    .get((req, res, next)=> {
        const knex = req.app.get('db')

        NotesService.getAllNotes(knex)
            .then((notes)=> res.json(serializeNotes(notes)))
            .catch(next)
    })
    .post(jsonParser, (req, res, next)=> {
        const knex = req.app.get('db')
        const { name, folder_id, content } = req.body
        const newNote = { name, folder_id, content }

        NotesService.insertNote(knex, newNote)
            .then((response)=> 

                res.status(201)
                    .location(path.posix.join(req.originalUrl, `/${response.id}`))
                    .json({
                        id: response.id,
                        name: xss(response.name),
                        modified: response.modified,
                        folder_id: response.folder_id,
                        content: xss(response.content),
                    })
            )
            .catch(next)
    })
    
notesRouter
    .route('/notes/:id')    
    .get((req, res, next)=> {
        const knex = req.app.get('db')
        const id = req.params.id

        NotesService.getNoteById(knex, id)
            .then((note)=> res.json({
                id: note.id,
                name: xss(note.name),
                modified: note.modified,
                folder_id: note.folder_id,
                content: xss(note.content)         
            }))
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const knex = req.app.get('db')
        const id = req.params.id
        const { name, folder_id, content } = req.body
        const updatedNote = {name, folder_id, content}

        NotesService.updateNote(knex, id, updatedNote)
            .then(()=> res.status(204).end())
            .catch(next)
    })
    .delete((req, res, next)=> {
        const knex = req.app.get('db')
        const id = req.params.id 

        NotesService.deleteNote(knex, id)
            .then(()=> res.status(204).end())
            .catch(next)
    })

module.exports = notesRouter