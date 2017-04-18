/**
 * Created by yqiao on 16/04/2017.
 */
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
    theme: 'snow'
});
quill.setContents(contentJson);

var form = document.querySelector('form');
form.onsubmit = function() {
    var chapterContent = document.querySelector('input[name=chapterContent]');
    chapterContent.value = JSON.stringify(quill.getContents());
};