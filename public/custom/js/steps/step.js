/**
 * Created by Cecilee2 on 8/4/2015.
 */

$(function () {

    //Delete a task
    $(document.body).on('click', '.delete_step',function(e){
        e.preventDefault();

        var parent = $(this).parent().parent();
        var step = parent.children(':nth-child(1)').html();
        var step_id =  $(this).val();

        bootbox.dialog({
            message: 'Are You sure You want to permanently delete step number: <span class="bold"> '+step+'</span>',
            title: '<span class="bold font-red">Warning Alert</span>',
            buttons: {
                danger: {
                    label: "NO",
                    className: "btn-default",
                    callback: function() {
                        $(this).hide();
                    }
                },
                success: {
                    label: "YES",
                    className: "btn-success",
                    callback: function() {
                        $.ajax({
                            type: 'DELETE',
                            async: true,
                            url: '/steps/' + step_id,
                            success: function(data,textStatus){
                                window.location.reload();
                                // window.location.replace('/steps');
                            },
                            error: function(xhr,textStatus,error){
                                bootbox.alert("Error encountered pls try again later..", function() {
                                    $(this).hide();
                                });
                            }
                        });
                    }
                }
            }
        });
    });

    //Validate Image Before Uploading
    validateImageFile($('#image_url'), 1048576, $('#confirm-upload'));

    ComponentsEditors.init();
});

var ComponentsEditors = function () {

    var handleSummernote = function () {
        // $('#instruction').summernote({height: 180});
        $('#instruction').summernote({
            callbacks: {
                onChange: function(contents) {
                    $('#describe').val(contents);
                    console.log('onChange:', contents);
                }
            },
            height: 180
        });
        //API:
        //var sHTML = $('#summernote_1').code(); // get code
        //$('#summernote_1').destroy(); // destroy
    };

    return {
        //main function to initiate the module
        init: function () {
            handleSummernote();
        }
    };

}();