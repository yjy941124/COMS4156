/**
 * Created by jinyangyu on 3/19/17.
 */
$(document).ready(function () {

    var user_id = $("#parse-user-id").html();
    var userRole = $('#parse-user-role').html();
    if (userRole == 'writer') {
        $('#publication-list').hide();
    }


});
