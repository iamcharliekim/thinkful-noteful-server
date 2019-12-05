const FoldersService = {
    getAllFolders(knex){
        return knex
            .from('folders')
            .select('*')
    },

    insertFolder(knex, folder){
        return knex
            .insert(folder)
            .into('folders')
            .returning('*')
            .then(result => result[0])
    },

    getFolderById(knex, id){
        return knex
            .select('*')
            .from('folders')
            .where({id})
            .first()
    },

    deleteFolder(knex, id){
        return knex
            .from('folders')
            .where({id})
            .delete()
    },

    updateFolder(knex, id, folder){
        return knex
            .from('folders')
            .update(folder)
            .where({id})
    }
}

module.exports = FoldersService