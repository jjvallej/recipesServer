const express = require('express');
const fs = require("fs");
const { isUndefined } = require('util');
const app = express(),
bodyParser = require("body-parser");
port = 3080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const userPath = './data/users.json';
const recipesPath = './data/recipes.json';

/*Funciones generales*/
/*
 * writeData:Escribe datos en archivo .json
 * @param {any} dataPath :Ruta del archivo a escribir
 * @param {any} data     :Datos a escribir
 */
const writeData = (dataPath,data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync(dataPath, stringifyData)
}
/**
 * readData : Lee datos de archivo .json
 * @param {any} dataPath :Ruta del archivo a leer
 * @returns :datos del archivo como JSON
 */
const readData = (dataPath) => {
    const jsonData = fs.readFileSync(dataPath)
    return JSON.parse(jsonData)
}

/**
 * Lee usuario del archivo json para enviar el objeto user
 *@method  : get
 *@path    : /api/user
 *@returns : json con  usuario
 *@param    email : email del usuario
 * 
 */
app.get('/api/user', (req, res) => {
    const email = req.query['email'];
    const users = readData(userPath);
    const user = users[0][email];
    /*const user = users.filter(function (e) {
        return e.id == email;
    });*/

    //users.stringify(key: email)
    //users.getI
    //const usersString = /*users.stringify(key: email);*/JSON.stringify(users[email]);
    //res.send(json.stringify(user));
    res.send(user);
});

/**
 * Crea o actualiza el usuario en el archivo json
 *@method  : post
 *@path    : /api/user
 *@param    email : email del usuario 
 *@body    : json usuario
 */
app.post('/api/user', (req, res) => {
    var users = readData(userPath);
    const email = req.query['email'];
    users[0][email] = req.body;
    writeData(userPath, users);
    res.send("Usuario adicionado");
});

/**
 * Lee recetas, opcional las de un usuario
 *@method  : get
 *@path    : /api/recipes
 *@returns : json con  recipes
 *@param    email : Opcional email del usuario para filtrar solo las recetas del usuario
 *
 */
app.get('/api/recipes', (req, res) => {
    const recipes = readData(recipesPath);
    let recipesFiltered = recipes;
    //const email = req.params['email'];
    const email = req.query['email'];
    if (isUndefined(email) && email != "") {
        let recipesFiltered = recipes.filter(function (e) {
            return e.owner == email;
        });
    }
    res.send(recipesFiltered);
});

/**Elimina la receta
 *@method  : delete
 *@path    : /api/recipes
 *@param    id : id de la receta a eliminar
 *
 */
app.delete('/api/recipe/', (req, res) => {
    var recipes = readData(recipesPath);
    //const id = req.params['id'];
    const id = req.query['id'];
    delete recipes[0][id];
    writeData(recipesPath, recipes);
    res.json("recipe removed");
});

/**crea o actualiza una receta
 *@method  : post
 *@path    : /api/recipes
 *@param    id : id de la receta a crear/actualizar
 *
 */
app.post('/api/recipe', (req, res) => {
    const recipe = req.body;
    var recipes = readData(recipesPath);
    var recipeID = Math.floor(100000 + Math.random() * 900000);
    if (!isUndefined(req.query['id'])) {
        recipeID = req.query['id'];
    }
    recipes[0][recipeID] = recipe;
    writeData(recipesPath, recipes);
    res.json("recipe added/updated");
});

app.get('/', (req, res) => {
    res.send('Recipes Server');
});

app.listen(port, () => {
    /*Read the json files*/

    console.log(`Server listening on the port::${port}`);
});