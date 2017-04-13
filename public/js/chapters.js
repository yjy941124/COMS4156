/* chapters */
var book_idForFunction;
var bookid;
$(document).ready(function () {
    var book_id=$("#parse-book-id").html();
    bookid = book_id;
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
    // Problem: since js now only choose to display modal css or hide modal css
    // pick a scene: if user edit book info, empty bookname, then click submit, then click cancel
    // then go back to edit bookinfo again, the bookname will be empty
    // Problem: in collaboration with publish.js: the alert banner won't show up multiple times
    // $(document).on("click", "#editbook_btn", function(){
    //     $('#bookinfo_modal').css("display","block");
    // });
    // // $(document).on("click", "#close", function(){
    // //     $('#bookinfo_modal').css("display","none");
    // // });
    // // $(document).on("click", "#save_bookchange", function(){
    // //     $('#bookinfo_modal').css("display","none");
    // // });
    // $(document).on("click", "#cancel_bookchange", function(){
    //     $('#bookinfo_modal').css("display","none");
    // });

});
function deletebook() {
    $.ajax({
        type: 'GET',
        url: '/service/deleteBook/'+bookid,
        success: function(res) {
            window.location.href = '/';

        }, error: function (err) {
            console.log(err);
        },
        contentType: "application/json",
        dataType: 'text'
    });
}