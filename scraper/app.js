const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const errorController = require('./controllers/errors/errorController');

const app = express();

const hbs = require('hbs');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs'); // Handlebars Engine

//app.engine('html', hbs.__express);

app.use(express.static(path.join(__dirname, 'public/')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(cookieParser());

app.use(session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    cookie : {maxAge : 600000},
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  }));


app.use('/', routes);

app.use(errorController.notFound);

if(app.get('dev') === 'development'){
    app.use(console.errorController.developmentErrors);
}

require('./lib/initializers');
