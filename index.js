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
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
var config = require('./config.js'), //config file contains all tokens and other private info
    funct = require('./functions.js');

//test if ignore works.

//===============PASSPORT=================

// Passport session setup.
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
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
        var user = req.user;
        var bookIDs = [];
        var bookList = items;
        //bookList is an array consisting of _id for each book in DB
        bookList.forEach(function (elem) {
            //assert that each bookIDs element is typeof String
            bookIDs.push(elem._id.toString());
        });
        /* bookList schema{
         * _id
         * bookname
         * bookdes
         * writerID
         * writerName
         */
        res.render('home', {
            user: user,
            bookList: bookList,
            bookIDs: bookIDs
        });
        console.log("print bookIDs array in corresponding order: ");
        console.log(bookIDs);
    }, function (err) {
        console.log("error occurs, details: " + err);
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

app.get('/profile/:userId', function (req, res) {

    var userId = req.params.userId;
    var userRole = req.user.role;
    console.log('============');
    funct.queryPublicationFromWriter(userId).then(function (publications) {
        res.render('profile', {
            userID: req.params.userId,
            userRole: userRole,
            publication: publications
        });
    });

});

/* since we have a render-for-all situation, I only render bookId to fetch all chapters */
/*WARNING: for now we are sending all books info to html. This may or may not impact large scale code and
 are subject to change.*/


//anonymous browse
app.get('/books/:bookId', function (req, res) {
    var bookId = req.params.bookId;
    funct.queryBookinfoFromID(bookId).then(function (item) {
        res.render('chaptersAnonymous', {
            bookID: bookId,
            book: item
        });
    });
});

//lack one function
app.get('/books/:bookId/:userId/:userRole', function (req, res) {
    var bookId = req.params.bookId;
    var userId=req.params.userId;
    var userRole=req.params.userRole;
    funct.queryBookinfoFromID(bookId).then(function (item) {
        res.render('chaptersRegistered', {
            bookID: bookId,
            book: item,
            userID: userId,
            userRole: userRole
        });
    });
});




app.get('/books/:bookId/:userId/:userRole/uploadNewChapter', function (req, res) {
    //more to render
    var bookID = req.params.bookId;
    res.render('uploadNewChapter', {
        bookID: bookID
    });
});

app.post('/util/uploadNewChapter', function (req, res) {
    funct.insertNewChapterToABook(req, res);
});

app.get('/books/:bookId/:chapterIdx', function (req, res) {
    var chapterIdx = parseInt(req.params.chapterIdx);
    var bookId = req.params.bookId;

    funct.queryOneChapterFromBook(chapterIdx, bookId).then(function(chapterInfos) {

        res.render('chapter',{
            chapter: chapterInfos[0],
            bookId: bookId,
            chapterIdx: chapterIdx,
            chapterMax: chapterInfos[1]
        });
    })
});

// to be modified
app.get('/util/subscribeBook/:bookId/:userId',function(req,res){
    var userId=req.params.userId;
    var bookId=req.params.bookId;
    console.log("User "+ userId+" is subscribing the book "+bookId);
    funct.insertNewSubscriptionToUser(userId,bookId);
    res.redirect('/');
});

//===============PORT=================
var port = process.env.PORT || 5000;
app.listen(port);
console.log("Listening on " + port + "!");
console.log("Go to http://localhost:" + port);
