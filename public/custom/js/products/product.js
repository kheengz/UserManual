/**
 * Created by Cecilee2 on 8/4/2015.
 */

$(function () {

    //Append new product row
    $('.add_product').click(function(e){
        e.preventDefault();
        var clone_row = $('#product_table tbody tr:last-child').clone();

        $('#product_table tbody').append(clone_row);

        clone_row.children(':nth-child(1)').html( parseInt(clone_row.children(':nth-child(1)').html())+1);
        clone_row.children(':nth-child(2)').children('input').val('');
        clone_row.children(':nth-child(2)').children('input[type=hidden]').val(-1);
        clone_row.children(':nth-child(3)').children('select').val('');
        clone_row.children(':nth-child(4)').children('input').val('');
        clone_row.children(':nth-child(5)').children('textarea').val('');
        clone_row.children(':nth-child(6)').html('');
        clone_row.children(':nth-child(7)').html(0);
        // clone_row.children(':nth-child(6)').html('<button class="btn btn-info btn-rounded btn-condensed btn-xs product_image" rel="-1">\
        //     <span class="fa fa-file-picture-o"></span> Upload </button>');
        clone_row.children(':last-child').html('<button class="btn btn-danger btn-rounded btn-condensed btn-xs remove_product"><span class="fa fa-times"></span> Remove</button>');
    });

    $(document.body).on('click','.remove_product',function(){
        $(this).parent().parent().remove();
    });

    //Delete a Product
    $(document.body).on('click', '.delete_product',function(e){
        e.preventDefault();

        var parent = $(this).parent().parent();
        var product = parent.children(':nth-child(2)').children('input').val();
        var product_id = parent.children(':nth-child(2)').children('input[type=hidden]').val();

        bootbox.dialog({
            message: 'Are You sure You want to permanently delete product:<span class="bold"> '+product+'</span>',
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
                            url: '/products/' + product_id,
                            success: function(data,textStatus){
                                window.location.replace('/products');
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
    
    //Attempt to upload product image
    $(document.body).on('click', '.product_image', function(e){
        var _id = $(this).val();
        var image = $(this).attr('rel');
        var name = $(this).parent().parent().children(':nth-child(2)').children('input').val();
        $('#product_id').val(_id);

        if(image == -1){
            $('#image_holder').html('<img src="http://www.placehold.it/300x250/EFEFEF/AAAAAA&amp;text=no+image" alt=""/>');
        }else {
            $('#image_holder').html('<img src="'+image+'" class="img-responsive pic-bordered" alt="'+name+'"/>');
        }
        $('#product_image_modal').modal('show');

        return false;
    });
    
    //Validate Image Before Uploading
    validateImageFile($('#product_image'), 1048576, $('#confirm-upload'));
});




