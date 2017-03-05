/**
 * Created by Cecilee2 on 8/4/2015.
 */

$(function () {

    //Delete a task
    $(document.body).on('click', '.delete_task',function(e){
        e.preventDefault();

        var parent = $(this).parent().parent();
        var task = parent.children(':nth-child(2)').html();
        var task_id =  $(this).val();

        bootbox.dialog({
            message: 'Are You sure You want to permanently delete task:<span class="bold"> '+task+'</span>',
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
                            url: '/tasks/' + task_id,
                            success: function(data,textStatus){
                                window.location.replace('/tasks');
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

    // Ajax Get Class Rooms Based on the Class Level
    getDependentListBox($('#product_id'), $('#module_id'), '/list-box/modules/');
    getDependentListBox($('#product'), $('#module'), '/list-box/modules/');
});




