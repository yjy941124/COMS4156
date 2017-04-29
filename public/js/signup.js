$(document).ready(function() {
    var lv= new localRegValidator();
    $('#account-form').ajaxForm({
        beforeSubmit : function(formData, jqForm, options){
            return lv.validateForm();
        },
        success	: function(responseText, status, xhr, $form){
            console.log(status);
            if (status == 'success') {
                window.location.href = '/';
            }
        },
        error : function(e){
            lv.showInvalidEmailorUsername();
        }
    })
});