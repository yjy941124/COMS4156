var express = require('express');
var expressLayouts = require('./express-layouts');
var passport = require('passport');
// var logger = require('morgan');
var LocalStrategy = require('passport-local');
var cookieParser = require('cookie-parser');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressLayouts);
app.use('/public', express.static('./public'));
app.set('views', './views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine

// app.use(logger);
app.use(cookieParser());

app.use(methodOverride());
app.use(session({
    secret: 'supernova',
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

var config = require('./config.js'), //config file contains all tokens and other private info
    funct = require('./functions.js');


//===============PASSPORT=================

// Passport session setup.
passport.serializeUser(function (user, done) {
    console.log("serializing " + user.username);
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    console.log("deserializing " + obj);
    done(null, obj);
});

// Use the LocalStrategy within Passport to login users.
passport.use('local-signin', new LocalStrategy(
    {passReqToCallback: true}, //allows us to pass back the request to the callback
    function (req, username, password, done) {
        funct.localAuth(username, password)
            .then(function (user) {
                if (user) {
                    console.log("LOGGED IN AS: " + user.username);
                    req.session.success = 'You are successfully logged in ' + user.username + '!';
                    done(null, user);
                }
                if (!user) {
                    console.log("COULD NOT LOG IN");
                    req.session.error = 'Could not log user in. Please try again.'; //inform user could not log them in
                    done(null, user);
                }
            })
            .fail(function (err) {
                console.log(err.body);
            });
    }
));

// Use the LocalStrategy within Passport to Register/"signup" users.
passport.use('local-signup', new LocalStrategy(
    {passReqToCallback: true}, //allows us to pass back the request to the callback
    function (req, username, password, done) {

        funct.localReg(username, password, req.body.role)
            .then(function (user) {
                if (user) {
                    console.log("REGISTERED: " + user.username);
                    req.session.success = 'You are successfully registered and logged in ' + user.username + '!';
                    done(null, user);
                }
                if (!user) {
                    console.log("COULD NOT REGISTER");
                    req.session.error = 'That username is already in use, please try a different one.'; //inform user could not log them in
                    done(null, user);
                }
            })
            .fail(function (err) {
                console.log(err.body);
            });
    }
));


// Simple route middleware to ensure user is authenticated.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.error = 'Please sign in!';
    res.redirect('/signin');
}


//===============EXPRESS=================

// Configure Express


// Session-persisted message middleware
app.use(function (req, res, next) {
    var err = req.session.error,
        msg = req.session.notice,
        success = req.session.success;

    delete req.session.error;
    delete req.session.success;
    delete req.session.notice;

    if (err) res.locals.error = err;
    if (msg) res.locals.notice = msg;
    if (success) res.locals.success = success;

    next();
});


/*// Configure express to use handlebars templates
 var hbs = exphbs.create({
 defaultLayout: 'main',
 });
 app.engine('handlebars', hbs.engine);
 app.set('view engine', 'handlebars');*/


//===============ROUTES=================
//displays our homepage
app.get('/', function (req, res) {
    funct.queryAllBook().then(function (items) {
        res.render('home', {
            user: req.user,
            bookList: items
        });
    }, function (err) {
        console.log("I receive error" + err);
    });


});

//displays our signup page
app.get('/signin', function (req, res) {
    res.render('signin');
});

//sends the request through our local signup strategy, and if successful takes user to homepage, otherwise returns then to signin page

app.post('/local-reg', function (req, res) {
    passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signin'
    })(req, res);
});

//sends the request through our local login/signin strategy, and if successful takes user to homepage, otherwise returns then to signin page
app.post('/login', passport.authenticate('local-signin', {
        successRedirect: '/',
        failureRedirect: '/signin'
    })
);

//logs user out of site, deleting them from the session, and returns to homepage
app.get('/logout', function (req, res) {
    var name = req.user.username;
    console.log("LOGGIN OUT " + req.user.username);
    req.logout();
    res.redirect('/');
    req.session.notice = "You have successfully been logged out " + name + "!";
});
//render publish page
app.get('/publish', function (req, res) {
    res.render('publish');
});
//writer publish a book
app.post('/publishBook', funct.publishBook);
//TODO look up query parameter. add get for each book.

//===============PORT=================
var port = process.env.PORT || 5000;
app.listen(port);
console.log("listening on " + port + "!");
