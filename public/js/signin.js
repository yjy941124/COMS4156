$(document).ready(function() {
    var sv = new SignInValidator();

    $('#login').ajaxForm({
        beforeSubmit: function(formData, jqForm, options) {
            if (sv.validateForm() == false) {
                return false;
            }
            else {
                return true;
            }
        },
        success: function(responseText, status, xhr, $form) {
            console.log(status);
            if (status == 'success') {
                window.location.href = '/';
            }
        },
        error: function(e) {
            sv.showSignInError('Login Failure', 'Please check your username and/or password');
        }
    })
});