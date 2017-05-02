function SignInValidator() {
    this.loginErrors = $('.modal-alert');

    this.showSignInError = function (t, m) {
        $('.modal-alert .modal-header h4').text(t);
        $('.modal-alert .modal-body').html(m);
        this.loginErrors.modal('show');
    }
}

SignInValidator.prototype.validateForm = function() {
    if ( $('#username-tf').val() == '') {
        this.showSignInError('Whoops', 'Please enter a valid username');
        return false;
    }
    else if ( $('#password-tf').val() == '' ) {
        this.showSignInError('Whoops', 'Please enter a valid password');
        return false;
    }
    else{
        return true;
    }
};