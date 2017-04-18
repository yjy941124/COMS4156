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

// ===============ROUTES=================
// homepage, display all books stored in database
app.get('/', function (req, res) {
    funct.queryAllBook().then(function (items) {
        var user = req.user;
        var bookIDs = [];
        var bookList = items;
        bookList.forEach(function (elem) {
            bookIDs.push(elem._id.toString());
        });
        res.render('home', {
            user: user,
            bookList: bookList,
            bookIDs: bookIDs
        });
    }, function (err) {
        console.log("error occurs, details: " + err);
    });
});

// display signin page, where you can either signin or signup a new account
app.get('/signin', function (req, res) {
    res.render('signin');
});

// sends the request through our local signup strategy, and if successful takes user to homepage, otherwise returns then to signin page
app.post('/local-reg', function (req, res) {
    passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signin'
    })(req, res);
});

// sends the request through our local login/signin strategy, and if successful takes user to homepage, otherwise returns then to signin page
app.post('/login', passport.authenticate('local-signin', {
        successRedirect: '/',
        failureRedirect: '/signin'
    })
);

// helper function, called when render homepage
function renderHomeHelper(req, res) {
    funct.queryAllBook().then(function (items) {
        var user = req.user;
        var bookIDs = [];
        var bookList = items;
        bookList.forEach(function (elem) {
            bookIDs.push(elem._id.toString());
        });
        res.render('home', {
            user: user,
            bookList: bookList,
            bookIDs: bookIDs
        });
    }, function (err) {
        console.log("error occurs, details: " + err);
    });
}

// logs user out of site, deleting them from the session, and returns to homepage
app.get('/logout', function (req, res) {
    var name = req.user.username;
    console.log("LOGGIN OUT " + req.user.username);
    req.logout();
    res.redirect('/');
    req.session.notice = "You have successfully been logged out " + name + "!";
});

// publish page, where user can publish new book
app.get('/publish', function (req, res) {
    if (req.user.role != "writer") {
        renderHomeHelper(req, res);
    }
    else {
        res.render('publish');
    }
});

// when publish form is submitted, post method '/publishBook' is called.
app.post('/publishBook', function (req, res) {
    if (req.user != null) {
        funct.publishBook(req, res)
            .then(function (book_id) {
                res.redirect('books/' + book_id);
            });
    }
    else {
        renderHomeHelper(req, res);
    }

});

// profile page, where user can check books published by him/her and books subscribed by him/her
app.get('/profile/:userId', function (req, res) {
    var userId = req.params.userId;
    var userRole = req.user.role;
    //var user = req.user;
    funct.queryUserBasedOnID(userId).then(function (item) {
        var user = item;
        funct.queryPublicationFromWriter(userId).then(function (set) {
            res.render('profile', {
                userID: req.params.userId,
                userRole: userRole,
                publication: set.publication,
                subscription: set.subscription,
                user: user
            });
        });
    });
});

/* since we have a render-for-all situation, I only render bookId to fetch all chapters */
/*WARNING: for now we are sending all books info to html. This may or may not impact large scale code and
 are subject to change.*/
app.get('/books/:bookId', function (req, res) {
    var bookId = req.params.bookId;
    var user = req.user;
    // if user is anonymous
    if (typeof user == "undefined") {
        funct.queryBookinfoFromID(bookId).then(function (item) {
            res.render('chapters', {
                bookID: bookId,
                book: item,
                user: req.user
            });
        });
    }
    // if user is registered
    else {
        var userId = req.user._id;
        funct.queryBookinfoFromID(bookId).then(function (item) {
            var book = item;
            funct.queryUserBasedOnID(userId).then(function (user) {
                res.render('chapters', {
                    user: user,
                    bookID: bookId,
                    book: book
                });
            });
        });
    }
});

// get method called when user wants to upload new chapter, render uploadNewChapter.ejs
app.get('/books/:bookId/uploadNewChapter', function (req, res) {
    var bookID = req.params.bookId;
    res.render('uploadNewChapter', {
        bookID: bookID
    });
});

// function insertNewChapterToABook called, when new chapter is inserted to database, and user is redirected to chapters page
app.post('/service/uploadNewChapter', function (req, res) {
    funct.insertNewChapterToABook(req, res);
});


// function updateBookInfo called, attributes of one book in database is altered, and user is redirected to chapters page
app.post('/books/:bookId/update', function (req, res) {
    var bookId = req.params.bookId;
    var userId = req.user._id;
    console.log("updating " + bookId + "'s bookinfo");
    funct.updateBookInfo(bookId, userId, req.body, res);
});

// display chapter content in one book
app.get('/books/:bookId/chapter/:chapterIdx', function (req, res) {
    var chapterIdx = parseInt(req.params.chapterIdx);
    var bookId = req.params.bookId;
    var user = req.user;
    funct.queryOneChapterFromBook(chapterIdx, bookId).then(function (chapterInfos) {

        res.render('chapter', {
            user: user,
            chapter: chapterInfos[0],
            chapterId: chapterInfos[0]._id,
            bookId: bookId,
            chapterIdx: chapterIdx,
            chapterMax: chapterInfos[1] - 1
        });
    })
});

// user subscribe book, add item to user.subscription in database
app.get('/service/subscribeBook/:bookId', function (req, res) {
    var userId = req.user._id;
    var bookId = req.params.bookId;
    funct.insertNewSubscriptionToUser(userId, bookId, req, res);
});

//get method, user unsubscribe book, delete item in user.subscription in database
app.get('/service/unsubscribeBook/:bookId', function (req, res) {
    var bookId = req.params.bookId;
    var userId = req.user._id;
    funct.deleteSubscriptionFromUser(userId, bookId, req, res);
});
app.get('/service/deleteBook/:bookId', function (req, res) {
    var book_id = req.params.bookId;
    funct.deleteBook(book_id).then(function () {
        res.send('book has been deleted!');
    });
});
app.get('/service/deleteChapter/:bookId/:chapterId', function (req, res) {
    console.log('here');
    var book_id = req.params.bookId;
    var chapter_id = req.params.chapterId;
    funct.deleteChapterFromOneBook(book_id, chapter_id).then(function () {
        res.send('this chapter has been deleted');
    })
});

//===============PORT=================
var port = process.env.PORT || 5000;
app.listen(port);
console.log("Listening on " + port + "!");
console.log("Go to http://localhost:" + port);
