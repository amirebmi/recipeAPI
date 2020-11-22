var express = require('express');
var router = express.Router();

// List all recipes.
router.get('/', async function(req, res, next) {
    
    let recipes = await req.app.locals.db.collection("recipes");

    res.json(await recipes.find().toArray());
});

// Search recipe names using MongoDB's text search.
router.get('/recipeSearch', async function(req, res, next) {

    let recipes = await req.app.locals.db.collection("recipes");

    let textSearch = req.body.recipe;

    const cursor = await recipes.find({$text: {$search: textSearch}});

    res.json(await cursor.toArray());
});

// Search recipes that use certain ingredients (for example "beef" and "potato").
router.get('/ingredientSearch', async function(req, res, next) {

    let recipes = await req.app.locals.db.collection("recipes");

    // Get the complete parameters from the body
    let bodyParamObject = req.body.ingredient;

    // Create a new array
    const parameters = [];

    for (let item in bodyParamObject){
        parameters.push({ingredients:{ $regex: bodyParamObject[item] }})
    }

    const crsr = await recipes.find({$and:parameters});

    res.json(await crsr.toArray()); 
});


// Add a recipe
router.post('/', async function(req, res, next){

    let recipes = await req.app.locals.db.collection("recipes");

    // Get the JSON body 
    const recipeObject = req.body;

    // Add the recipe object to the database
    await recipes.insertOne(recipeObject);

    // response Create status code and the object's Id
    res.status(201).send(recipeObject._id);
});


module.exports = router;
