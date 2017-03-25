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

    var updateBookInfoUrl = '/books/' + book_id + '/update';
    $('#edit-book-info').attr("action", updateBookInfoUrl);

    /* Open and Close Edit Book Info Panel */
    $(document).on("click", "#editbook_btn", function(){
        $('#bookinfo_modal').css("display","block");
    });
    $(document).on("click", "#close", function(){
        $('#bookinfo_modal').css("display","none");
    });
    $(document).on("click", "#save_bookchange", function(){
        $('#bookinfo_modal').css("display","none");
    });
    $(document).on("click", "#cancel_bookchange", function(){
        $('#bookinfo_modal').css("display","none");
    });

});
