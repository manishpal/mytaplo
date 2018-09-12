const mongoose = require('mongoose');

require('dotenv').config({path:'variables.env'});

mongoose.connect(process.env.DATABASE);

mongoose.connection.on('error',(err) => {
    console.error(`Database Error -> ${err.message}`);
});

// Importing all the models
require('./models/BrcData');
require('./lib/initializers');

const app = require('./app');

app.set('port', process.env.PORT || 8081);

const server = app.listen(app.get('port'), () => {
    console.log(`Backend Application is running at ${server.address().port}`);
});
