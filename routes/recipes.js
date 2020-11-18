var express = require('express');
var router = express.Router();

// List all recipes.
router.get('/', async function(req, res, next) {
    
    let recipes = await req.app.locals.db.collection("recipes");

    res.json(await recipes.find().toArray());
});

// Search recipe names using MongoDB's text search.
router.post('/search1', async function(req, res, next) {

    let recipes = await req.app.locals.db.collection("recipes");

    let textSearch = req.body.search;

    const cursor2 = await recipes.find({$text: {$search: textSearch}}, {$caseSensitive: true});

    res.json(await cursor2.toArray());
});

// Search recipes that use certain ingredients (for example "beef" and "potato").
router.post('/search2', async function(req, res, next) {

    let recipes = await req.app.locals.db.collection("recipes");

    let textSearch1 = req.body.search1;
    let textSearch2 = req.body.search2;

    const query = {
        $and: [{
        ingredients: { $regex: textSearch1 }
        },
        {
        ingredients: { $regex: textSearch2 }
        }
        ]};

    const cursor1 = await recipes.find(query, {_id:1,name:1});

    res.json(await cursor1.toArray());
});


// Add a recipe
router.post('/', async function(req, res, next){

    let recipes = await req.app.locals.db.collection("recipes");

    let name = req.body.name;
    let yield = req.body.yield;
    let ingredients = req.body.ingredients;
    let directions = req.body.directions;
});


module.exports = router;
