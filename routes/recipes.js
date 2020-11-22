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

    let textSearch = req.body.recipe;

    const cursor = await recipes.find({$text: {$search: textSearch}}, {$caseSensitive: true});

    res.json(await cursor.toArray());
});

// Search recipes that use certain ingredients (for example "beef" and "potato").
router.post('/search2', async function(req, res, next) {

    let recipes = await req.app.locals.db.collection("recipes");

    // Get the complete parameters from the body
    let bodyParamObject = req.body;

    // Create new arrays
    const parameters = [];

    for (let item in bodyParamObject){
        parameters.push({ingredients:{ $regex: bodyParamObject[item] }})
    }

    const crsr = await recipes.find({$and:parameters}, {_id:1,name:1});

    res.json(await crsr.toArray()); 
});


// Add a recipe
router.post('/Add', async function(req, res, next){

    let recipes = await req.app.locals.db.collection("recipes");

    // Create a recipe object
    const recipe = {
        name: req.body.name,
        yield: req.body.yield,
        ingredients: req.body.ingredients,
        directions: req.body.directions
    }

    // Add the recipe object to the database
    await recipes.insertOne(recipe);

    // response Create status code and the object's Id
    res.status(201).send(recipe._id);
});


module.exports = router;
