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

//used in local-signup strategy
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

/* Not in use
 * Query book object and user object in a nested manner
 * input: (bookid,userid)
 * output: an array [book,user]
 */
exports.queryBookandUser = function (bookid, userid) {
    var results = [];
    return MongoClient.connect(mongodbUrl, function (err, db) {
        //var results = [];
        var books = db.collection('Books');
        var users = db.collection('Users');
        books.findOne({
            '_id': new ObjectId(bookid)
        }).then(function (book) {
            results.push(book);
            return results
        }).then(function(results){
            users.findOne({
                '_id': new ObjectId(userid)
            }).then(function(user){
                results.push(user);
                return results;

            }).then(function(item){
                return item;
            });
        }).then(function(item){
            return item;
        });
    }).then(function(item){
        return item;
    });
};

exports.publishBook = function (req, res) {
    var bookname = req.body.bookname;
    var bookdes = req.body.bookDescription;
    var writerID = req.user._id.toString();
    var writerName = req.user.username;
    var book = {
        'bookname': bookname,
        'bookdes': bookdes,
        'writerID': writerID,
        'writerName': writerName
    };
    MongoClient.connect(mongodbUrl, function (err, db) {
        var books = db.collection('Books');
        var users = db.collection('Users');
        books.insertOne(book).then(function (result) {
            var book_id = (result.ops)[0]._id;
            users.updateOne(
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
                });
        });
    });
    console.log(book);
    res.send('published!');
};

exports.queryAllBook = function () {
    return MongoClient.connect(mongodbUrl).then(function (db) {
        var books = db.collection('Books');
        return books.find({}).toArray();
    }).then(function (items) {
        console.log("All books available on Forever Read are...");
        console.log(items);
        return items;
    });
};

exports.queryPublicationFromWriter = function (user_id) {
    return MongoClient.connect(mongodbUrl).then(function (db) {
        var users = db.collection('Users');
        return users.findOne({'_id': new ObjectId(user_id)})
            .then(function (result) {
                console.log(result.publication);
                return result.publication;
            })
    }).then(function (items) {
        return items;
    })
};


// to query all chapters from one book


exports.queryChaptersFromBook = function (book_id){
    return MongoClient.connect(mongodbUrl).then(function(db){
        var books=db.collection('Books');
        return books.findOne({'_id':new Object(book_id)})
            .then(function(result){
                return result.chapters;
            })
    }).then(function (items) {
        return items;
    })
};

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

exports.queryBookinfoFromID = function(book_id){
    return MongoClient.connect(mongodbUrl).then (function(db){
        var books=db.collection('Books');
        return books.findOne({'_id':new ObjectId(book_id)})
            .then(function(result){
                console.log(result);
                return result;
            })
    }).then(function(items){
        return items;
    });
};
exports.insertNewChapterToABook = function (req, res) {
  var book_id = req.body.bookid[0];
  MongoClient.connect(mongodbUrl).then (function (db) {
      var books = db.collection('Books');
      books.findOneAndUpdate(
          {'_id' : new ObjectId(book_id)},
          {$push : {
              chapters : {
                  _id:ObjectId(),
                  title: req.body.title,
                  content: req.body.chapterContent
              }
          }},
      {upsert: true})
          .then(function () {
              console.log('chapter update success');
              db.close();
          })
  }).then(function () {
      res.redirect('/books/'+book_id);
  })
};

exports.queryOneChapterFromBook = function (chapterIdx, bookId) {
    return MongoClient.connect(mongodbUrl).then(function (db) {
        var books = db.collection('Books');
        return books.findOne({'_id':new ObjectId(bookId)})
            .then(function (result) {//console.log(result.chapters[chapterIdx]);
                return [result.chapters[chapterIdx], result.chapters.length];
            })
    }).then(function (item) {

        return item;
    })
};

/*exports.addNewChapterUsingBookID = function (book_id) {
    MongoClient.connect(mongodbUrl).then (function (db) {
        var books = db.collection('Books');
        return books.updateOne(
            {_id: new ObjectId(book_id)},
            {
                $push:{
                    chapters:{
                        'title' :
                    }
                }
            }
            )
    })
}*/

//insert one book to a user's subscription
exports.insertNewSubscriptionToUser=function(user_id,book_id,req,res){
    MongoClient.connect(mongodbUrl).then(function(db){
        var users=db.collection('Users');
        users.findOneAndUpdate(
                {'_id': new ObjectId(user_id)},
                {$push: {
                    subscriptions: {
                        _id:ObjectId(),
                        bookId: book_id
                    }
                }
                },
                {upsert:true})
                .then(function(){
                    console.log("insert subscription is a success");
                    db.close();
                }).then(function(){
            res.redirect('/');
        })
    });
};

//delete one user's subscription
exports.deleteSubscriptionFromUser=function(user_id, book_id, req, res){
    MongoClient.connect(mongodbUrl).then(function(db){
        var users=db.collection('Users');
        users.findOneAndUpdate(
                {'_id':new ObjectId(user_id)},
                {$pull:{
                    subscriptions:{
                        bookId: book_id
                    }
                }},
                {upsert:true})
                .then(function(){
                    console.log("unsubscription is a success");
                    db.close();
                }).then(function(){
                    res.redirect('/');
        });
    });
};




