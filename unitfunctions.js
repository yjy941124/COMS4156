/**
 * Created by jinyangyu on 4/6/17.
 */
exports.publishBook = function(bookname, bookdes, bookgenre, writerID, writerName) {
    var book = {
        'bookname': bookname,
        'bookdes': bookdes,
        'bookgenre': bookgenre,
        'writerID': writerID,
        'writerName': writerName
    };
    return book;
};

exports.publishChapter = function(chpname,chpcontent, writerID, writerName) {
    var chapter = {
        'chpname': chpname,
        'chpcontent': chpcontent,
        'writerID': writerID,
        'writerName': writerName
    };
    return chapter;
};


exports.updateBookInfo = function(book, editedbookname){
    book.bookname = editedbookname;
    return book;
};


// Integration Test
exports.publishBookIntegration = function(){

}