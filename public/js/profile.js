/* profile.js */

$(document).ready(function () {

    var user_id = $("#parse-user-id").html();
    var userRole = $('#parse-user-role').html();
    if (userRole == 'writer') {
        $('#publication-list').hide();
    }
    var book_id=$("#parse-book-id").html();


});
