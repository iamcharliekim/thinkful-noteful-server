const NotesService = {
    getAllNotes(knex){
        return knex
            .select('*')
            .from('notes')
    },

    insertNote(knex, note){
        return knex
            .insert(note)
            .into('notes')
            .returning('*')
            .then(result => result[0])
    },

    getNoteById(knex, id){
        return knex
            .select('*')
            .from('notes')
            .where({id})
            .first()

    },

    deleteNote(knex, id){
        return knex
            .from('notes')
            .where({id})
            .delete()

    },

    updateNote(knex, id, note){
        return knex
            .from('notes')
            .where({id})
            .update(note)
    }
}

module.exports = NotesService