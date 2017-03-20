/**
 * Created by jinyangyu on 3/15/17.
 */
$(document).ready(function () {
    var user = getUser();
    //console.log(user);
    var user_id = $("#parse-user-id").html();
    var profileRedirectURL = "/profile/" + user_id;
    var userRole = $("#parse-user").html();

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



