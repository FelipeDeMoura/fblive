// server.js
// BASE SETUP
// =========================================

// call the packages we need
var express    = require('express');
var app        = express();     // define our app using express
//var bodyParser = require('body-parser');
//var media      = require('./app/models/media');

app.set('views', './app/templates');
// set the view engine to ejs
app.set('view engine', 'ejs');

// question on this process ?
var port = process.env.PORT || 8080;    // set our port

// ROUTES FOR OUR API
// =========================================

// index page
app.get('/', function(req, res) {
    res.render('pages/index');
});


app.use(express.static('./app'));

// START THE SERVER
// =========================================
app.listen(port);
console.log('test facebook live api ', port);
