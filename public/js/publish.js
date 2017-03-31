/* publish */
$(document).ready(function () {
    $('#submit-publish-form').click(function(e) {
        var isValid = true;
        $('input[type="text"]').each(function() {
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
});
function empty() {
    var x;
    x = document.getElementById("book-name").value;
    if (x == "") {
        alert("Book name cannot be empty!");
        return false;
    }
}