function localRegValidator() {
    this.formFields = [$('input[name=role]'), $('#email-tf'), $('#username-tf'), $('#password-tf')];
    this.controlGroups = [$('#user-role-cg'), $('#email-cg'), $('#username-cg'), $('#password-cg')];
    this.alert = $('.modal-form-errors');
    this.alert.modal({ show : false, keyboard : true, backdrop : true});

    this.validateRole = function(s)
    {
        for (var i=0; i< s.length; i++){
            if (s[i].checked){
                return true;
            }
        }
        return false;
    };

    this.validatePassword = function(s)
    {
        // if user is logged in and hasn't changed their password, return ok
        return s.length >= 6;
    };

    this.validateEmail = function(e)
    {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(e);
    };

    this.showErrors = function(a)
    {
        $('.modal-form-errors .modal-body p').text('Please correct the following problems :');
        var ul = $('.modal-form-errors .modal-body ul');
        ul.empty();
        for (var i=0; i < a.length; i++) ul.append('<li>'+a[i]+'</li>');
        this.alert.modal('show');
    }

    this.validateName = function(s)
    {
        return s.length >= 3;
    }

}

localRegValidator.prototype.showInvalidEmailorUsername = function()
{
    this.controlGroups[1].addClass('error');
    this.showErrors(['That email address or username is already in use.']);
};

localRegValidator.prototype.validateForm = function()
{
    var e = [];
    for (var i=0; i < this.controlGroups.length; i++) this.controlGroups[i].removeClass('error');
    if (this.validateRole(this.formFields[0]) == false) {
        this.controlGroups[0].addClass('error'); e.push('Please Select Your Role');
    }
    if (this.validateEmail(this.formFields[1].val()) == false) {
        this.controlGroups[1].addClass('error'); e.push('Please Enter A Valid Email');
    }
    if (this.validateName(this.formFields[2].val()) == false) {
        this.controlGroups[2].addClass('error');
        e.push('Please Enter A Username');
    }
    if (this.validatePassword(this.formFields[3].val()) == false) {
        this.controlGroups[3].addClass('error');
        e.push('Password Should Be At Least 6 Characters');
    }
    if (e.length) this.showErrors(e);
    return e.length === 0;
};


