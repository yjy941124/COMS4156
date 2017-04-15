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

var content_string = document.querySelector('#parse-editor-delta').innerHTML;
var contentJson = JSON.parse(content_string);
console.log(content_string);

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