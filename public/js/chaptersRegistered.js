$(document).ready(function () {
    var book_id=$("#parse-book-id").html();
    var user_id=$("#parse-user-id").html();
    var user_role=$("#parse-user-role").html();
    //upload Chapter
    var uploadChapterUrl = '/books/' + book_id +'/'+ user_id + '/' + user_role + '/uploadNewChapter';
    $("#upload-chapter").attr("href", uploadChapterUrl);
    //subscribe to this book
    //TODO
    var subscribeBookUrl= '/util' + '/subscribeBook/'+book_id;
    $('#subscribe-book').attr("href",subscribeBookUrl);
});



