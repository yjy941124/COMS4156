/**
 * Created by jinyangyu on 4/6/17.
 */
var assert = require('assert');var expect = require("chai").expect;
var unitfunc = require("./unitfunctions");
var config = require('./config.js');
var funct = require("./functions");
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
    describe("#UpdateBookInfo",function(){
        it ("update bookname of one book",function(){
            var book = unitfunc.publishBook('a','b','c','d','e');
            book = unitfunc.updateBookInfo(book);
            expect(book.bookname).to.equal('testbookname');
        })
    });

});
describe('Users', function () {
    describe('#Sign up', function () {
        it("signs up a new user", function () {
            funct.localReg('testwriter','testwriter','writer');
        })
    })
});





