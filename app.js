require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');

// Import Handlebars and allow prototype access
const { engine } = require('express-handlebars');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

// Import routes
const indexRouter = require('./app_server/routes/index'); // Frontend routes
const apiRouter = require('./app_api/routes/index'); // API routes

// Import database connection
require('./app_api/models/db');
require('./app_api/config/passport');

const app = express();

// Set up Handlebars as the view engine with prototype access
app.engine('hbs', engine({
    extname: 'hbs',
    defaultLayout: 'main', // Default layout file
    layoutsDir: path.join(__dirname, 'app_server', 'views', 'layouts'),
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'app_server', 'views'));

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter); // Frontend routes
app.use('/api', apiRouter); // API routes

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Render the error page
    res.status(err.status || 500);
    res.render('error');
});

//enable CORS
app.use('/api',(req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header("Access-Control-Allow-Headers", 'Origin, X-Requested-With, Content-Type, Accept, Authoerization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
})

//catch unauthorized errors and create 401
app.use((err,req, next) => {
    if (err,name === 'UnauthorizedError') {
        res
            .status(401)
            .json({ "message": err.name + ": " + err.message });
    }
});
// Serve favicon to resolve the 404 error
app.use('/favicon.ico', express.static(path.join(__dirname, 'public', 'favicon.ico')));

module.exports = app;
