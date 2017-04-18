/**
 * Created by jinyangyu on 4/6/17.
 */
var assert = require('assert');
var expect = require("chai").expect;
var unitfunc = require("./unitfunctions");
var config = require('./config.js');
var funct = require("./functions");
var mongodbUrl = 'mongodb://' + config.mongodbHost + ':27017/test';
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var request = require('request');


describe('Books', function () {
    describe('#PublishNewBook', function () {
        it("publishes a new book", function () {
            var book = unitfunc.publishBook('a','b','c','d','e');
            expect(book.bookname).to.equal('a');
        })
    });
    describe('#PublishNewChapter', function () {
        it("publishes a new chapter", function () {
            var chapter = unitfunc.publishChapter('a', 'b', 'c', 'd');
            expect(chapter.chpname).to.equal('a');
        })
    });
    describe('#EditBookInfo', function () {
        it("Edits a book's info", function () {
            var book = unitfunc.publishBook('a','b','c','d','e');
            var newbook = unitfunc.updateBookInfo(book,'editedname');
            expect(newbook.bookname).to.equal('editedname');
        })
    });

});
describe('Users', function () {
    describe('#Sign up', function () {
        it("signs up a new user", function () {
            funct.localReg('testwriter1','testwriter','writer');
            MongoClient.connect(mongodbUrl).then(function (db) {
                var users = db.collection('Users');
                users.findOne({
                    'username': 'testwriter'
                })
            })
        })
    });
    describe('#Sign in', function () {
        it("signs in an old user", function () {
            funct.localAuth('testwriter','testwriter');
        })
    });
    describe('#Subscribe', function () {
        it("Subscribes a book", function () {
            var subscription = false;
            expect(unitfunc.subscribeBook(subscription)).to.equal(true);
        })
    });
    describe('#Unsubscribe', function () {
        it("Unsubscribes a book", function () {
            var subscription = true;
            expect(unitfunc.unsubscribeBook(subscription)).to.equal(false);
        })
    });
});

describe("Integration test",function() {
    describe("render homepage", function () {
        var url = "http://localhost:5000";
        it("returns status code 200", function () {
            request(url, function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            })
        });
    });
});


