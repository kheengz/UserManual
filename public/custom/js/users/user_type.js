/**
 * Created by Cecilee2 on 8/4/2015.
 */

$(function () {

    $('.add_user_type').click(function(e){
        e.preventDefault();
        var clone_row = $('#menu_table tbody tr:last-child').clone();

        $('#menu_table tbody').append(clone_row);

        clone_row.children(':nth-child(1)').html( parseInt(clone_row.children(':nth-child(1)').html())+1);
        clone_row.children(':nth-child(2)').children('input').val('');
        clone_row.children(':nth-child(2)').children('input[type=hidden]').val(-1);
        clone_row.children(':last-child').html('<button class="btn btn-danger btn-rounded btn-condensed btn-xs remove_user_type"><span class="fa fa-times"></span> Remove</button>');
    });

    $(document.body).on('click','.remove_user_type',function(){
        $(this).parent().parent().remove();
    });

    $(document.body).on('click', '.delete_user_type',function(e){
        e.preventDefault();

        var parent = $(this).parent().parent();
        var user_type = parent.children(':nth-child(2)').children('input').val();
        var user_type_id = parent.children(':nth-child(2)').children('input[type=hidden]').val();
        // console.log(user_type_id);

        bootbox.dialog({
            message: 'Are You sure You want to permanently delete user type:<span class="bold"> '+user_type+'</span>',
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
                            url: '/user-types/' + user_type_id,
                            success: function(data,textStatus){
                                window.location.replace('/user-types');
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
});




