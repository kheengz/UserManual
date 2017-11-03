/**
 * Created by Emmanuel on 8/30/2016.
 */
var Product = require('../../models/product');
var helper = require('../../utils/helper');
var multer  = require('multer');
var path = require('path');
var mkdirp = require('mkdirp');
var _ = require('underscore');
// var upload = multer({ dest: 'public/uploads/' });

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var uploadPath = 'public/uploads/products/';
        mkdirp.sync(uploadPath);
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, req.body.product_id + path.extname(file.originalname));
    }
});
var upload = multer({ storage: storage, limits:{fileSize:1000000} }).single('product_image');

module.exports = {
    
    index: function (req, res) {

        Product.find()
            // .sort('-createdAt')
            .sort('name')
            .exec(function (err, products) {
                if (err) {
                    var error = helper.transformToError({code: 503, message: "Error in server interaction"}).toCustom();
                    req.flash('error','Problem retrieving products, try again!');
                    res.render('pages/products/index',
                        {
                            title: 'Products',
                            error: error
                        });
                }
                else {
                    // res.json({product: products[2].name, modules: products[2].modules()});
                    res.render('pages/products/index',
                        {
                            title: 'Products',
                            products: products
                        });
                }
            });
    },

    updateProducts: function (req, res) {
        // res.json(req.body);
        var _ids = req.body['_ids[]'];
        var names = req.body['names[]'];
        var order_bys = req.body['order_bys[]'];
        var actives = req.body['actives[]'];
        var describes = req.body['describes[]'];
        var len = 1; var saved = 0; var updated = 0;
        var arr = false;
        if(Array.isArray(names)){
            len = names.length;
            arr = true;
        }
        for(var i = 0;  i < len; i++){
            var obj = {
                name : (arr) ? names[i] : names,
                _id : (arr) ? _ids[i] : _ids,
                order_by : (arr) ? order_bys[i] : order_bys,
                describe : (arr) ? describes[i] : describes,
                active : (arr) ? actives[i] : actives
            };
            if(obj._id == '-1'){
                delete obj._id;
                var product = new Product(obj);
                product.save(function (err,data) {
                    if(err) {
                        req.flash('danger','Problem retrieving Products, try again!')
                    }
                });
                saved++;

            }else{
                Product.update({_id: obj._id}, obj, {upsert: true,  setDefaultsOnInsert: true}, function (err, data) {
                    if(err) {
                        req.flash('danger','Problem retrieving Products, try again!')
                    }
                });
                updated++;
            }
        }
        req.flash('success', 'Successfully Executed!!! created:' + saved + ', updated:' + updated);
        res.redirect('products');
    },

    deleteProduct: function (req, res) {
        Product.findOne({_id: req.params.product_id})
            .exec(function (err, product) {
                if (err) {
                    var error = helper.transformToError({code: 503, message: "Error in server interaction"}).toCustom();
                    req.flash('error','Problem retrieving product, try again!');
                    req.flash('danger','Problem retrieving product, try again!');
                    res.render('pages/products/index',
                        {
                            title: 'Products',
                            error: error
                        });
                }
                else {
                    Product.remove({_id:product._id})
                        .exec(function (err, produ) {
                            if(err) {
                                req.flash('danger','Problem retrieving product, try again!');
                            }else {
                                req.flash('success','Successfully Executed!!! ' + product.name + ' deleted');
                                res.json({success: 'Successfully Executed!!! ' + product.name + ' deleted'}); 
                            }
                        });
                }
            });
    },

    imageUpload: function (req, res) {
        upload(req, res, function (err) {
            if (err) {
                // An error occurred when uploading
                req.flash('danger', 'Problem uploading product image, try again!' + err);
                console.log(err);
                // res.json({err:err});
                return
            }
            // Everything went fine
            // var pa = req.file.path.substring(_.indexOf(req.file.path, '/'));
            // res.json({body:req.body, file:req.file, path:pa});
            Product.findOne({_id: req.body.product_id})
                .exec(function (err, product) {
                    if (err) {
                        req.flash('danger','Problem retrieving product, try again!');
                        res.render('pages/products/index',
                            {
                                title: 'Products',
                                error: err
                            });
                    }
                    else {
                        var obj = {
                            _id : req.body.product_id,
                            image_url : req.file.path.substring(_.indexOf(req.file.path, '/'))//path.join(req.file.destination, req.file.filename)
                        };
                        Product.update({_id: obj._id}, obj, {upsert: true,  setDefaultsOnInsert: true}, function (err, data) {
                            if(err) {
                                req.flash('danger','Problem updating Products Image, try again!')
                            }else {
                                req.flash('success','Successfully Executed!!! ' + product.name + ' image was uploaded');
                                res.redirect('/products');
                            }
                        });
                    }
                });
        })
    }
};
