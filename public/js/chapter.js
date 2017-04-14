/**
 * Created by jinyangyu on 4/13/17.
 */


$(document).ready(function () {

})
function deleteChapter() {
    var book_id=$("#parse-book-id").html();
    var chapter_id = $("#parse-chapter-id").html();
    console.log(chapter_id);
    $.ajax({
        type: 'GET',
        url: '/service/deleteChapter/'+book_id +'/' + chapter_id,
        success: function(res) {
            window.location.href = '/books/' + book_id;
        }, error: function (err) {
            console.log(err);
        },
        contentType: "application/json",
        dataType: 'text'
    });
}