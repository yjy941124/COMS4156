/*
 * publish.js functionality: ensure input with class="publish-non-empty" is not empty
 * subscribed by:
 *  * publish.ejs - when publishing book, bookname should not be empty
 *  * uploadNewChapter.ejs - when uploading new chapter, chapter's name should not be empty
 */
$(document).ready(function () {
    $('#submit-publish-form,#new-chapter-submit, #save_bookchange').click(function(e) {
        var isValid = true;
        $('input[type="text"].publish-non-empty').each(function() {
            if ($.trim($(this).val()) == '') {
                isValid = false;
                $(this).css({
                    "border": "1px solid red",
                    "background": "#FFCECE"
                });
            }
            else {
                $(this).css({
                    "border": "",
                    "background": ""
                });
            }
        });
        if (isValid == false)
            e.preventDefault();
    });

    // $('#save_bookchange').click(function(){
    //     console.log('here');
    //     var nonempty;
    //     for (var i=0; i<document.getElementsByClassName('publish-non-empty').length;i++){
    //         nonempty = document.getElementsByClassName('publish-non-empty')[i].value;
    //         if (nonempty ==''){
    //             //alert("some fields can not be left empty");
    //             $('.alert').show();
    //             return false;
    //         }
    //     }
    // })
});
function empty() {
    var x;
    //since getElementsByClassName return nodelist
    for (var i=0; i<document.getElementsByClassName('publish-non-empty').length; i++) {
        x = document.getElementsByClassName('publish-non-empty')[i].value;
        if (x == "") {
            // alert("Some fields can not be left empty");
            $('.alert').show();
            return false;
        }
    }
}