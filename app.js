const express = require('express');
const path = require('path');
const methodOverride = require('method-override');

const app = express();


app.set('view engine', 'ejs');


app.use(express.urlencoded({ extended: false }))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/views'));

app.get('/', (req, res) => {
    res.render('static/html/index.ejs');
});

app.get('/physio-shoulder1',(req,res) => {
    res.render('static/html/exercise1.ejs');
});



app.listen(3000, () => {
    console.log('Serving on port 3000')
})