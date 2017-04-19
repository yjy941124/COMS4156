/*
 * publish.js functionality: ensure input with class="publish-non-empty" is not empty and associating alert behavior
 * subscribed by:
 *  * publish.ejs - when publishing book, bookname should not be empty
 *  * uploadNewChapter.ejs - when uploading new chapter, chapter's name should not be empty
 *  * chapters.ejs - when editing book info, bookname should not be empty
 */
$(document).ready(function () {
    // if modal is cancelled, then content: bookname bookdes go back to initial form
    $('.modal').on('hidden.bs.modal', function(){
        $(this).find('form')[0].reset();
    });
    var user_id = $("#parse-user-id").html();
    var profileRedirectURL = "/profile/" + user_id;
    $("#profile-redirect-url").attr("href", profileRedirectURL);
    $('#submit-publish-form,#new-chapter-submit, #save_bookchange, #edit-chapter-submit').click(function(e) {
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

    // if modal is canceled, then alerts go back to initial state
    $('#cancel_bookchange').click(function(){
        $('input[type="text"].publish-non-empty').each(function(){
            $(this).css({
                "border": "",
                "background":""
            });
        });
        $('.alert').hide();
    });

    // if bootstrap alert is closed, then alert hides
    $('.close').click(function(e){
        $('#non-empty-alert').hide();
    })

});
function empty() {
    var x;
    //since getElementsByClassName return nodelist
    for (var i=0; i<document.getElementsByClassName('publish-non-empty').length; i++) {
        x = document.getElementsByClassName('publish-non-empty')[i].value;
        if (x == "") {
            // alert("Some fields can not be left empty");
            $('#non-empty-alert').show();
            return false;
        }
    }
}