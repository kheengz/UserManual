/**
 * Created by Cecilee2 on 8/4/2015.
 */

$(function () {

    //Add an empty module row
    $('.add_module').click(function(e){
        e.preventDefault();
        var clone_row = $('#module_table tbody tr:last-child').clone();

        $('#module_table tbody').append(clone_row);

        clone_row.children(':nth-child(1)').html( parseInt(clone_row.children(':nth-child(1)').html())+1);
        clone_row.children(':nth-child(2)').children('input').val('');
        clone_row.children(':nth-child(2)').children('input[type=hidden]').val(-1);
        clone_row.children(':nth-child(3)').children('select').val('');
        clone_row.children(':nth-child(4)').children('textarea').val('');
        clone_row.children(':nth-child(5)').children('select').val('');
        clone_row.children(':nth-child(6)').children('input').val('');
        clone_row.children(':nth-child(7)').html('');
        clone_row.children(':last-child').html('<button class="btn btn-danger btn-rounded btn-condensed btn-xs remove_module"><span class="fa fa-times"></span> Remove</button>');
    });

    //Remove an empty module row
    $(document.body).on('click','.remove_module',function(){
        $(this).parent().parent().remove();
    });

    //Delete a module
    $(document.body).on('click', '.delete_module',function(e){
        e.preventDefault();

        var parent = $(this).parent().parent();
        var module = parent.children(':nth-child(2)').children('input').val();
        var module_id = parent.children(':nth-child(2)').children('input[type=hidden]').val();

        bootbox.dialog({
            message: 'Are You sure You want to permanently delete module:<span class="bold"> '+module+'</span>',
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
                            url: '/modules/' + module_id,
                            success: function(data,textStatus){
                                window.location.replace('/modules');
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

    //Attempt to upload module image
    $(document.body).on('click', '.module_image', function(e){
        var _id = $(this).val();
        var image = $(this).attr('rel');
        var name = $(this).parent().parent().children(':nth-child(2)').children('input').val();
        $('#module_id').val(_id);

        if(image == -1){
            $('#image_holder').html('<img src="http://www.placehold.it/300x250/EFEFEF/AAAAAA&amp;text=no+image" alt=""/>');
        }else {
            $('#image_holder').html('<img src="'+image+'" class="img-responsive pic-bordered" alt="'+name+'"/>');
        }
        $('#module_image_modal').modal('show');

        return false;
    });

    //Validate Image Before Uploading
    validateImageFile($('#module_image'), 1048576, $('#confirm-upload'));

   setTableData($('#module_table')).init();
});




