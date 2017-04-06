/**
 * Created by jinyangyu on 4/6/17.
 */
var assert = require('assert');var expect = require("chai").expect;
var unitfunc = require("./unitfunctions");
var config = require('./config.js');
var funct = require("./functions");


describe('Books', function () {
    describe('#PublishNewBook', function () {
        it("publishes a new book", function () {
            var book = unitfunc.publishBook('a','b','c','d','e');
            expect(book.bookname).to.equal('a');
        })
    });
    describe('#EditBook', function () {
        it("edits book info", function () {
            var chapter = unitfunc.publishChapter('a', 'b', 'c', 'd');
            expect(chapter.chpname).to.equal('a');
        })
    })
});
