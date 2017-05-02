/* profile.js */

$(document).ready(function () {

    var user_id = $("#parse-dedicated-user-id").html();
    var userRole = $('#parse-user-role').html();
    //if (userRole == 'writer') {
      //  $('#publication-list').hide();
    //}
    var book_id=$("#parse-book-id").html();

    var profileRedirectURL = "/profile/" + user_id;
    $("#profile-redirect-url").attr("href", profileRedirectURL);

});
