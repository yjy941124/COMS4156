/* chapters */
var book_idForFunction;
$(document).ready(function () {
    var book_id=$("#parse-book-id").html();
    book_idForFunction = book_id;
    var uploadChapterUrl = '/books/' + book_id + '/uploadNewChapter';
    var subscribeBookUrl='/service/' + 'subscribeBook/' + book_id ;
    var unsubscribeBookUrl='/service/'+'unsubscribeBook/'+book_id ;
    $('#upload-chapter').attr("href", uploadChapterUrl);
    $('#subscribe-book').attr("href",subscribeBookUrl);
    $('#unsubscribe-book').attr("href",unsubscribeBookUrl);
});
