//Import modules
const express = require('express')
const sqlDAO = require('./mySQLDAO')
const app = express()
const port = 3000
const ejs = require('ejs');

//Use EJS to display html
app.set('view engine', 'ejs');

//Display home.ejs if at localhost:3000
app.get('/', (req, res) => {
  res.render('home')
})

//Display the stores page
app.get('/stores', async (req, res) =>{
  //Attempt to call the listStores function in the SQL DAO
  try{
    var allStores = await sqlDAO.listStores();
    res.render('stores', {allStores : allStores});
  }
  //if unsuccesful
  catch (err){
    console.error(err);
    res.status(500).send('SQL Connection Pool error');
  }
})

//Display the products page
app.get('/products', async (req, res) =>{
  //Attempt to call the listStores function in the SQL DAO
  try{
    var allProducts = await sqlDAO.listProducts();
    res.render('products', {allProducts : allProducts});
  }
  //if unsuccesful
  catch (err){
    console.error(err);
    res.status(500).send('SQL Connection Pool error');
  }
})


//Basic feedback for server console
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})