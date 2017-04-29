var bcrypt = require('bcryptjs'),
    Q = require('q'),
    config = require('./config.js'); //config file contains all tokens and other private info


// setup MongoDB connection information
var mongodbUrl = 'mongodb://' + config.mongodbHost + ':27017/foreverRead';
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;


// read credential information from credential.json, which is gitignored
var conf = require('./credential.json');

//setup EmailJS smtp information, note that we store our email sending acct infomation at OS level
//you can also set up account infomation in .profile or .bashrc
// export EMAIL_HOST=''
// export EMAIL_USER=''
// export EMAIL_PASS=''
// export EMAIL_FROM=''

var EM = {};

var email = require('emailjs');
EM.server = email.server.connect({
    host: conf.host || 'smtp.gmail.com',
    user: conf.user || 'this-email-address@gmail.com',
    password: conf.password || '012345',
    ssl: true
});

EM.dispatchSubscription = function(account, book, callback){
    EM.server.send({
        from: conf.user || 'Forever Read <do-not-reply@gmail.com>',
        to: account.emailaddr,
        subject: 'Subscription Alert',
        text: 'You have subscribed to something interesting in Forever Read',
        attachment: EM.composeSubscriptionEmail(account, book)
    },callback);
};

EM.dispatchChapterUpdate = function(account, book, chapter, callback){
    EM.server.send({
        from: conf.user || 'Forever Read <do-not-reply@gmail.com>',
        to: account.emailaddr,
        subject: 'The book' + book.bookname + ' just release a new chapter!',
        text: 'A new chapter is a go!',
        attachment: EM.composeChapterUpdateEmail(account, book, chapter)
    },callback);
};

EM.composeSubscriptionEmail = function(o1, o2){
    var html = "<html><body>";
    html += "Hi, " + o1.username + ",<br>";
    html += "You have subscribed to book " + o2.bookname +"<br>";
    html += "Log into Forever Read to read more!<br>";
    html += "Cheers,<br>";
    html += "Forever Read";
    html += "</body></html>";
    return [{data: html, alternative:true}];
};

EM.composeChapterUpdateEmail = function(o1, o2, o3){
    var html = "<html><body>";
    html += 'Hi, ' + o1.username + ",<br>";
    html += 'You have subscribed to book ' + o2.bookname + '<br>';
    html += 'It now releases a new chapter ' + o3 + '<br>';
    html += 'Log into Forever Read to read more!';
    html += 'Cheers,<br>';
    html += 'Forever Read';
    html += '</body></html>';
    return [{data:html, alternative: true}];
};



function IDGenerator() {
    var id = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 32; i++) {
        id += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return id;
}

// used in local-signup strategy
exports.localReg = function (username, password, role, email) {
    var deferred = Q.defer();
    var userID = IDGenerator;
    var IDexist = true;
    MongoClient.connect(mongodbUrl, function (err, db) {
        var collection = db.collection('Users');
        //check if username or email address is already assigned in our database
        //if collection.findOne({}) query returns null, then we can register this new user to database
        collection.findOne({
            $or:[
                {'username': username},
                {'emailaddr': email}
                ]})
            .then(function (result) {
                if (null != result) {
                    console.log("USERNAME OR EMAIL ADDRESS ALREADY EXISTS")
                    console.log("USERNAME:", result.username);
                    console.log("EMAIL ADDRESS:", result.emailaddr);
                    deferred.resolve(false); // username exists
                }
                else {
                    var hash = bcrypt.hashSync(password, 8);
                    var user = {
                        "username": username,
                        "password": hash,
                        "role": role,
                        "emailaddr": email
                    };

                    console.log("CREATING USER:", username);

                    collection.insertOne(user)
                        .then(function () {
                            db.close();
                            deferred.resolve(user);
                        });
                }
            });
    });
    return deferred.promise;
};

//TODO add alert window for username already exists.

//check if user exists
//if user exists check if passwords match (use bcrypt.compareSync(password, hash); // true where 'hash' is password in DB)
//if password matches take into website
//if user doesn't exist or password doesn't match tell them it failed
exports.localAuth = function (username, password) {
    var deferred = Q.defer();

    MongoClient.connect(mongodbUrl, function (err, db) {
        var collection = db.collection('Users');

        collection.findOne({'username': username})
            .then(function (result) {
                if (null == result) {
                    console.log("USERNAME NOT FOUND:", username);
                    deferred.resolve(false);
                }
                else {
                    var hash = result.password;

                    console.log("FOUND USER: " + result.username);

                    if (bcrypt.compareSync(password, hash)) {
                        deferred.resolve(result);
                    } else {
                        console.log("AUTHENTICATION FAILED");
                        deferred.resolve(false);
                    }
                }
                db.close();
            });
    });

    return deferred.promise;
};

//  Not in use
//  Query book object and user object in a nested manner
//  input: (bookid,userid)
//  output: an array [book,user]

// exports.queryBookandUser = function (bookid, userid) {
//     var results = [];
//     return MongoClient.connect(mongodbUrl, function (err, db) {
//         //var results = [];
//         var books = db.collection('Books');
//         var users = db.collection('Users');
//         books.findOne({
//             '_id': new ObjectId(bookid)
//         }).then(function (book) {
//             results.push(book);
//             return results
//         }).then(function (results) {
//             users.findOne({
//                 '_id': new ObjectId(userid)
//             }).then(function (user) {
//                 results.push(user);
//                 return results;
//
//             }).then(function (item) {
//                 return item;
//             });
//         }).then(function (item) {
//             return item;
//         });
//     }).then(function (item) {
//         return item;
//     });
// };

// publish book
// 1. form new object book={bookname, bookdes, bookgenre, writerID, writerName}
//    insert book to collection db.Books in foreverRead database
// 2. form new object as {book_id, bookname}, insert to collection db.Users.publication with Users._id==writerID
// note that db.Users.publication is an array of objects
exports.publishBook = function (req, res) {
    var bookname = req.body.bookname;
    var bookdes = req.body.bookDescription;
    var bookgenre = req.body.bookGenre;
    var writerID = req.user._id.toString();
    var writerName = req.user.username;
    var book = {
        'bookname': bookname,
        'bookdes': bookdes,
        'bookgenre': bookgenre,
        'writerID': writerID,
        'writerName': writerName,
        'subscribedNumber':0
    };
    var book_id;
    return MongoClient.connect(mongodbUrl).then(function (db) {
        var books = db.collection('Books');
        var users = db.collection('Users');
        return books.insertOne(book).then(function (result) {
            book_id = (result.ops)[0]._id;
            return users.updateOne(
                {_id: new ObjectId(writerID)},
                {
                    $push: {
                        publication: {
                            'book_id': new ObjectId(book_id),
                            'bookname': bookname
                        }
                    }
                },
                {upsert: true})
                .then(function () {
                    console.log("Update success");
                    db.close();
                    return book_id;
                });

        });
    });
};

// update book info
// 1. in db.Users.publication (publication is an array of objects), look up the object with Users._id == req.user._id, and update bookname in this object
// 2. in db.Books, locate the object with Books._id == book_Id, update attribute bookname, bookdes and bookgenre in this object
exports.updateBookInfo = function (book_Id, user_Id, info, res) {
    var new_bookname = info.bookname;
    var new_bookdes = info.bookDescription;
    var new_bookGenre = info.bookGenre;
    MongoClient.connect(mongodbUrl, function (err, db) {
        var books = db.collection('Books');
        var users = db.collection('Users');
        console.log("update function");
        users.updateOne(
            {
                "_id": new ObjectId(user_Id),
                "publication.book_id": new ObjectId(book_Id)
            },
            {
                $set: {
                    "publication.$.bookname": new_bookname
                }
            },
            {upsert: true}
        ).then(function () {
            users.updateOne(
                {
                    "_id": new ObjectId(user_Id),
                    "subscriptions.bookId": book_Id
                },
                {
                    $set: {
                        "subscriptions.$.bookname": new_bookname
                    }
                }
            )
        })
            .then(function () {
                books.updateOne(
                    {"_id": new ObjectId(book_Id)},
                    {
                        $set: {
                            "bookname": new_bookname, "bookdes": new_bookdes, "bookgenre": new_bookGenre
                        }
                    }
                )
                    .then(function (res) {
                        db.close();
                    });
            })
    });
    res.redirect('/books/' + book_Id);
};

// query all objects in db.Books, return in form of array
exports.queryAllBook = function () {
    return MongoClient.connect(mongodbUrl).then(function (db) {
        var books = db.collection('Books');
        return books.find({}).toArray();
    }).then(function (items) {

        return items;
    });
};

// query publication and subscription of one particular user with Users._id==user_id
// return an object of {publication, subscription}
exports.queryPublicationFromWriter = function (user_id) {
    return MongoClient.connect(mongodbUrl).then(function (db) {
        var users = db.collection('Users');
        return users.findOne({'_id': new ObjectId(user_id)})
            .then(function (result) {
                var publicationAndSubscriptionSet = {
                    'publication': result.publication,
                    'subscription': result.subscriptions
                }
                return publicationAndSubscriptionSet;
            })
    }).then(function (items) {
        return items;
    })
};


// query all chapters from one object in db.Books with Book._id==book_id
exports.queryChaptersFromBook = function (book_id) {
    return MongoClient.connect(mongodbUrl).then(function (db) {
        var books = db.collection('Books');
        return books.findOne({'_id': new Object(book_id)})
            .then(function (result) {
                return result.chapters;
            })
    }).then(function (items) {
        return items;
    })
};

// query user object in db.Users with Users._id==user_id
exports.queryUserBasedOnID = function (user_id) {
    return MongoClient.connect(mongodbUrl).then(function (db) {
        var users = db.collection('Users');
        return users.findOne({'_id': new ObjectId(user_id)})
            .then(function (result) {
                return result;
            })
    }).then(function (user) {
        return user;
    });
};

// query book object in db.Users with Books._id==book_id
exports.queryBookinfoFromID = function (book_id) {
    return MongoClient.connect(mongodbUrl).then(function (db) {
        var books = db.collection('Books');
        return books.findOne({'_id': new ObjectId(book_id)})
            .then(function (result) {

                return result;
            })
    }).then(function (items) {
        return items;
    });
};

// insert new object to db.Books.chapters as {_id, title, content} with Books._id=book_id
exports.insertNewChapterToABook = function (req, res) {
    var book_id = req.body.bookid[0];
    var book;
    var chapter = req.body.title;
    var account;
    MongoClient.connect(mongodbUrl).then(function (db) {
        var books = db.collection('Books');
        books.findOne({'_id': new ObjectId(book_id)}).then(function(elem){
            book = elem;
        });
        var users = db.collection('Users');
        users.find({'subscriptions':{$elemMatch:{bookId: book_id}}}).forEach(function(item){
            console.log("chapter is " + chapter);
            console.log("book is" + book);
            console.log(book.bookname);
            console.log("account is"+ item);
            console.log(item.emailaddr);
            account = item;
            EM.dispatchChapterUpdate(account, book, chapter);

        });
        books.findOneAndUpdate(
            {'_id': new ObjectId(book_id)},
            {
                $push: {
                    chapters: {
                        _id: ObjectId(),
                        title: req.body.title,
                        content: req.body.chapterContent
                    }
                }
            },
            {upsert: true})
            .then(function () {
                console.log('chapter update success');
                db.close();
            })
    }).then(function () {
        res.redirect('/books/' + book_id);
    })
};

// query one chapter of Books.chapters with Books_id=bookId
exports.queryOneChapterFromBook = function (chapterIdx, bookId) {
    return MongoClient.connect(mongodbUrl).then(function (db) {
        var books = db.collection('Books');
        return books.findOne({'_id': new ObjectId(bookId)})
            .then(function (result) {
                return [result.chapters[chapterIdx], result.chapters.length, result.writerID];
            })
    }).then(function (item) {
        return item;
    })
};


// insert new subscription to user
// checking db.Books, find bookname of object with Books._id==book_id
// finding Users object in db.Users with Users._id==user_id, insert new object {_id,bookId,bookname} to .subscriptions
exports.insertNewSubscription = function (user_id, book_id, req, res) {
    MongoClient.connect(mongodbUrl).then(function (db) {
        var users = db.collection('Users');
        var books = db.collection('Books');
        var bookname;
        var book;
        var account;
        books.updateOne(
                {'_id': new ObjectId(book_id)},
                {$inc:{
                    'subscribedNumber':1
                }}
                );
        books.findOne({'_id': new ObjectId(book_id)})
            .then(function (item) {
                book = item;
                console.log('book is '+ book);
                console.log('the subsribed number of this book is ' + item.subscribedNumber);
                bookname = (item.bookname);
                users.findOne({'_id': new ObjectId(user_id)}).then(function(elem){
                    var account = elem;
                    console.log('account is '+ account);
                    EM.dispatchSubscription(account, book);
                });
                users.findOneAndUpdate(
                    {'_id': new ObjectId(user_id)},
                    {
                        $push: {
                            subscriptions: {
                                _id: ObjectId(),
                                bookId: book_id,
                                bookname: bookname
                            }
                        }
                    },
                    {upsert: true})
                    .then(function () {
                        db.close();
                    }).then(function () {
                    res.redirect('/books/' + book_id);
                })
            });
    });
};

// delete one subscription object from user
// finding Users object in db.Users with Users._id==user_id, delete object.subscriptions with BookId==book_id
exports.deleteSubscription = function (user_id, book_id, req, res) {
    MongoClient.connect(mongodbUrl).then(function (db) {
        var users = db.collection('Users');
        var books = db.collection('Books');
        books.updateOne(
                {'_id': new ObjectId(book_id)},
                {$inc:{
                    'subscribedNumber':-1
                }}
        );
        users.findOneAndUpdate(
            {'_id': new ObjectId(user_id)},
            {
                $pull: {
                    subscriptions: {
                        bookId: book_id
                    }
                }
            },
            {upsert: true})
            .then(function () {
                db.close();
            }).then(function () {
            res.redirect('/books/' + book_id);
        });
    });
};
exports.deleteBook = function (book_id) {

    return MongoClient.connect(mongodbUrl).then(function (db) {

        var books = db.collection('Books');
        var users = db.collection('Users');
        users.updateMany(
            {},
            {
                $pull: {
                    "subscriptions": {"bookId": book_id.toString()},
                    "publication": {"book_id": new ObjectId(book_id)}
                }
            },
            {upsert: true}
        ).then(function () {
            books.deleteOne({"_id": new ObjectId(book_id)});
        }).then(function () {
            db.close();
        })
    })
};

exports.deleteChapterFromOneBook = function (book_id, chapter_id) {
    return MongoClient.connect(mongodbUrl).then(function (db) {
        var books = db.collection('Books');
        books.updateOne(
            {"_id": new ObjectId(book_id)},
            {$pull: {"chapters": {"_id": new ObjectId(chapter_id)}}}
        ).then(function () {
            db.close();
        })
    })
};

// query all objects in db.Books by bookgenre, return in form of array
exports.queryAllBookByGenre = function (genreType) {
    var genre = genreType;
    return MongoClient.connect(mongodbUrl).then(function (db) {
        var books = db.collection('Books');
        return books.find({"bookgenre": genre}).toArray();
    }).then(function (items) {
        return items;
    });
};

// query one chapter in db.Books
exports.queryOneChapterFromBookByChapterId = function (bookId, chapterId){
    return MongoClient.connect(mongodbUrl).then(function(db){
        var books = db.collection('Books');
        console.log("=====");
        console.log(bookId);
        console.log(chapterId);
        return books.findOne(
                {'_id': new ObjectId(bookId)},
                {'chapters': { $elemMatch: {_id: new ObjectId(chapterId)} } }).then(function(result){
                    return result.chapters[0];
        })
    }).then (function(items){
        return items;
    });
};


// save edited chapter into db.Books
exports.insertEditedChapterToABook = function(bookId, chapterId, chapterTitle, chapterContent, req, res) {
    return MongoClient.connect(mongodbUrl).then(function(db) {
        var books = db.collection('Books');
        books.updateOne(
                {"_id": new ObjectId(bookId),
                    "chapters._id": new ObjectId(chapterId)
                },
                {
                    $set:{
                        "chapters.$.title": chapterTitle,
                        "chapters.$.content": chapterContent
                    }
                },
                {upsert: true}
        )
    }).then(function(){
        res.redirect('/books/' + bookId);
    });
};

// search book by name
exports.searchBookByName = function(bookNameSearched) {
    var bookNameSearched = bookNameSearched;
    console.log("book searched is " + bookNameSearched);
    return MongoClient.connect(mongodbUrl).then(function (db) {
        var books = db.collection('Books');
        return books.find({'bookname': {$regex: bookNameSearched}}).toArray();
    }).then(function (items) {
        return items;
    });
};

exports.insertCommentToABook = function (bookId, comment, username) {
    return MongoClient.connect(mongodbUrl).then(function (db) {
        var books = db.collection('Books');
        books.updateOne(
            {
                "_id" : new ObjectId(bookId)
            },
            {
                $push: {
                    comments:{
                        comment:comment,
                        commenter: username
                    }
                }
            },
            {upsert: true}
        )
    })
};