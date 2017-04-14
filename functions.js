var bcrypt = require('bcryptjs'),
    Q = require('q'),
    config = require('./config.js'); //config file contains all tokens and other private info


// setup MongoDB connection information
var mongodbUrl = 'mongodb://' + config.mongodbHost + ':27017/foreverRead';
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

function IDGenerator() {
    var id = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 32; i++) {
        id += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return id;
}

// used in local-signup strategy
exports.localReg = function (username, password, role) {
    var deferred = Q.defer();
    var userID = IDGenerator;
    var IDexist = true;
    MongoClient.connect(mongodbUrl, function (err, db) {
        var collection = db.collection('Users');
        //check if username is already assigned in our database
        collection.findOne({'username': username})
            .then(function (result) {
                if (null != result) {
                    console.log("USERNAME ALREADY EXISTS:", result.username);
                    deferred.resolve(false); // username exists
                }
                else {
                    var hash = bcrypt.hashSync(password, 8);
                    var user = {
                        "username": username,
                        "password": hash,
                        "role": role
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
        'writerName': writerName
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
    MongoClient.connect(mongodbUrl).then(function (db) {
        var books = db.collection('Books');
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
                return [result.chapters[chapterIdx], result.chapters.length];
            })
    }).then(function (item) {
        return item;
    })
};


// insert new subscription to user
// checking db.Books, find bookname of object with Books._id==book_id
// finding Users object in db.Users with Users._id==user_id, insert new object {_id,bookId,bookname} to .subscriptions
exports.insertNewSubscriptionToUser = function (user_id, book_id, req, res) {
    MongoClient.connect(mongodbUrl).then(function (db) {
        var users = db.collection('Users');
        var books = db.collection('Books');
        var bookname;
        books.findOne({'_id': new ObjectId(book_id)})
            .then(function (item) {
                bookname = (item.bookname);
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
exports.deleteSubscriptionFromUser = function (user_id, book_id, req, res) {
    MongoClient.connect(mongodbUrl).then(function (db) {
        var users = db.collection('Users');
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
