//Import modules
const express = require('express')
const app = express()
const port = 3000
const ejs = require('ejs');

//Use EJS to display html
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  res.render('home')
})


//Basic feedback for server console
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})