/* chapters */
var book_idForFunction;
$(document).ready(function () {
    var book_id=$("#parse-book-id").html();
    book_idForFunction = book_id;
});

function updateNewChapter() {
    $.ajax({
        type: 'POST',
        url: '/uploadNewChapter',
        data: JSON.stringify({"bookid" : book_idForFunction}), // or JSON.stringify ({name: 'jonas'}),
        success: function(data) {

            console.log('here');
            console.log(data);

        }, error: function (data) {
            console.log(data);
        },
        contentType: "application/json",
        dataType: 'text'
    });
}