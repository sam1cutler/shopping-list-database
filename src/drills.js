require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
});

function getAllContents() {
    knexInstance
        .select('*')
        .from('shopping_list')
        .then(result => {
            console.log(result)
        });
}

//getAllContents();

function searchByQuery(searchTerm) {
    knexInstance
        .select('name', 'category')
        .from('shopping_list')
        .where(
            'name',
            'ILIKE',
            `%${searchTerm}%`
        )
        .then(result => {
            console.log(result)
        });
}

// searchByQuery('an');

function paginateList(pageNumber) {
    const itemsPerPage = 6;
    const offset = itemsPerPage * (pageNumber - 1)
    knexInstance
        .select('name','price','date_added','checked','category')
        .from('shopping_list')
        .limit(itemsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result)
        });
}

// paginateList(6);

function itemsAddedSince(daysAgo) {
    knexInstance
        .select('name','price','date_added','checked','category')
        .from('shopping_list')
        .where(
            'date_added',
            '>',
            knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
        )
        .then(result => {
            console.log(result)
        });
}

// itemsAddedSince(10);

function totalCostByCategory() {
    knexInstance
        .select('category')
        .sum('price AS total_price')
        .from('shopping_list')
        .groupBy('category')
        .orderBy([
            { column: 'total_price', order: 'DESC' },
        ])
        .then(result => {
            console.log(result)
        });
}

totalCostByCategory();