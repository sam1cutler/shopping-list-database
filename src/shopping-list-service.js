const ShoppingListService = {
    
    // Get everything
    getAllItems(knex) {
        return knex
            .select('*')
            .from('shopping_list')
    },

    // Get by specific ID
    getItemById(knex, id) {
        return knex
            .select('*')
            .from('shopping_list')
            .where('id', id)
            .first()
    },

    // Insert new list item
    insertItem(knex, newItem) {
        return knex
            .insert(newItem)
            .into('shopping_list')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    // Update a list item
    updateItem(knex, id, newItemFields) {
        return knex
            .from('shopping_list')
            .where( { id } )
            .update(newItemFields)
    },

    // Delete a list item
    deleteItem(knex, id) {
        return knex
            .from('shopping_list')
            .where( { id } )
            .delete()
    },
};

module.exports = ShoppingListService;