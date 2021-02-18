const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const cors = require('cors');

const morgan = require('morgan');

const passport = require('passport');

const authRoute = require('./routes/auth.js');
const taskRoute = require('./routes/task.js');

const app = express();

const keys = require('./config/keys.js');

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.connect(keys.mongoURI)
	.then(() => console.log('MongoDB has been connected.'))
	.catch(error => console.log(error));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cors());

app.use(morgan('dev'));

app.use(passport.initialize());
require('./middleware/passport.js')(passport);

app.use('/api/auth', authRoute);
app.use('/api/task', taskRoute);

module.exports = app;