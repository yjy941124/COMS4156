/* chapters */
var book_idForFunction;
$(document).ready(function () {
    var book_id=$("#parse-book-id").html(),
    book_idForFunction = book_id;
    //upload Chapter
    var uploadChapterUrl = '/books/' + book_idForFunction + '/uploadNewChapter';
    $('#upload-chapter').attr("href", uploadChapterUrl);
    //subscribe to this book
    var subscribeBookUrl= '/books/' + book_idForFunction + '/subscribeBook'+'/subscribe';
    console.log(subscribeBookUrl);
    $('#subscribe-book').attr("href",subscribeBookUrl);
});

