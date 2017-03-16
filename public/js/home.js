/**
 * Created by jinyangyu on 3/15/17.
 */
$(document).ready(function () {
    var user = getUser();
    //console.log(user);

    var userRole = $("#parse-user").html();
    console.log(userRole);
    if (userRole == 'writer') {
        $("#publish-page").html("<a id='publish' class='btn btn-default btn-md' role='button'>Publish Page</a>");
    }
});
