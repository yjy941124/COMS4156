/* home.js, in corresponding to home.ejs */

$(document).ready(function () {

    //var user = getUser();
    var user_id = $("#parse-user-id").html();
    var profileRedirectURL = "/profile/" + user_id;
    var userRole = $("#parse-user").html();
    var book_id=$("#parse-book-id").html();
    var bookRedirectURL="/books/"+book_id;

    $("#book-redirect-url").attr("href",bookRedirectURL);
    if (userRole == 'writer') {
        $("#publish-page").html("<a id='publish' href='/publish' class='btn btn-default btn-md' role='button'>Publish Page</a>");
    }
    $("#profile-redirect-url").attr("href", profileRedirectURL);


});

function getUserProfile(queryURL) {
    $.ajax({
        type: 'GET',
        url: queryURL,
        //data: JSON.stringify({"value" : privateKey}), // or JSON.stringify ({name: 'jonas'}),
        success: function(data) {

            console.log('here');
            console.log(data);

        }, error: function (err) {
            console.log(err);
        },
        contentType: "application/json",
        dataType: 'json'
    });
}



