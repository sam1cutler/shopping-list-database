const ShoppingListService = require('../src/shopping-list-service');
const knex = require('knex');
const { expect } = require('chai');

describe(`Shopping list service object`, function() {

    let db;

    let testItems = [
        {
            id: 1,
            name: 'Cinnamon toast crunch',
            price: '3.99',
            date_added: new Date('2020-12-28T01:00:00.000Z'),
            checked: true,
            category: 'Main'
        },
        {
            id: 2,
            name: 'Sliced cheddar cheese',
            price: '5.99',
            date_added: new Date('2020-12-29T02:00:00.000Z'),
            checked: false,
            category: 'Lunch'
        },
        {
            id: 3,
            name: 'Ketchup',
            price: '2.49',
            date_added: new Date('2020-12-30T08:00:00.000Z'),
            checked: true,
            category: 'Main'
        },
    ]

    // Establish connection to database
    before( () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    // Clear list before starting testing
    before( () => db('shopping_list').truncate() );

    // Clean up after each test
    afterEach( () => db('shopping_list').truncate() );

    // Clean up after all testing
    after( () => db.destroy() );

    // Tests for when table has data
    context(`Given 'shopping_list' has data`, () => {

        // For all these tests, want to start by populating table with test items
        beforeEach( () => {
            return db
                .into('shopping_list')
                .insert(testItems)
        })

        it(`getAllItems() provides all items from 'shopping_list' table`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(testItems)
                })
        })

        it(`getItemById() resolves an item from 'shopping_list' table by its id`, () => {
            const targetId = 2
            const targetItem = testItems[targetId - 1];
            return ShoppingListService.getItemById(db, targetId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: targetId,
                        name: targetItem.name,
                        price: targetItem.price,
                        date_added: targetItem.date_added,
                        checked: targetItem.checked,
                        category: targetItem.category
                    })
                })
        })

        it(`deleteItem() deletes an item from the 'shopping_list' table`, () => {
            const targetId = 2
            return ShoppingListService.deleteItem(db, targetId)
                .then( () => ShoppingListService.getAllItems(db) )
                .then( allItems => {
                    const expected = testItems.filter(item => item.id !== targetId)
                    expect(allItems).to.eql(expected)
                })
        })

        it(`updateItem() updates a list item in 'shopping_list' table`, () => {
            const targetId = 2;
            const newItemData = {
                name: 'New food item',
                price: '19.99',
                date_added: new Date(),
                category: 'Breakfast',
                checked: false
            };
            return ShoppingListService.updateItem(db, targetId, newItemData)
                .then( () => ShoppingListService.getItemById(db, targetId))
                .then( item => {
                    expect(item).to.eql({
                        id: targetId,
                        ...newItemData,
                    })
                })
        })

    })

    // Tests for when table has no data
    context(`Given 'shopping_list' has no data`, () => {

        it(`getAllItems() resolves an empty array`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })

        it(`insertItem() inserts an item into 'shopping_list' table and resolves new item with an id`, () => {
            const newItemData = {
                name: 'New food item',
                price: '19.99',
                date_added: new Date(),
                category: 'Breakfast',
                checked: false
            };
            return ShoppingListService.insertItem(db, newItemData)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        name: newItemData.name,
                        price: newItemData.price,
                        date_added: newItemData.date_added,
                        category: newItemData.category,
                        checked: newItemData.checked
                    })
                })
        })
    })

})