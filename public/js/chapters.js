/* chapters */
var book_idForFunction;
$(document).ready(function () {
    var book_id=$("#parse-book-id").html(),
    book_idForFunction = book_id;
    //upload Chapter
    var uploadChapterUrl = '/books/' + book_idForFunction + '/uploadNewChapter';
    $('#upload-chapter').attr("href", uploadChapterUrl);
    //subscribe to this book
    var subscribeBookUrl= '/util' + '/subscribeBook/'+ book_idForFunction;
    $('#subscribe-book').attr("href",subscribeBookUrl);
});

