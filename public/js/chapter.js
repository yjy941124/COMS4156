/**
 * Created by jinyangyu on 4/13/17.
 */


$(document).ready(function () {
    var chapter_id = $('#parse-chapter-id').html();
    var book_id=$("#parse-book-id").html();
    // var editChapterUrl = '/books/' + book_id + '/chapter/' + chapter_id + '/editChapter';
    // var editChapterUrl  = '/test/'
    var editChapterUrl = '/books/' + book_id + '/chapter/editChapter/' + chapter_id;
    console.log(editChapterUrl);
    $('#edit-chapter').attr("href", editChapterUrl);

    var user_id = $("#parse-user-id").html();
    var profileRedirectURL = "/profile/" + user_id;
    $("#profile-redirect-url").attr("href", profileRedirectURL);


});
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

var content_string = document.querySelector('#parse-editor-delta').innerHTML;
var contentJson = JSON.parse(content_string);

var quill = new Quill('#editor-container', {
    // modules: {
    //     toolbar: [
    //         [{ header: [1, 2, false] }],
    //         ['bold', 'italic', 'underline'],
    //     ]
    // },
    placeholder: 'This is where it all starts...',
    theme: 'bubble',
    readOnly: true
});
quill.setContents(contentJson);