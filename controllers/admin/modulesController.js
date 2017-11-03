/**
 * Created by Emmanuel on 8/30/2016.
 */

var Module = require('../../models/module');
var Product = require('../../models/product');
var async = require('async');
var helper = require('../../utils/helper');
var multer  = require('multer');
var path = require('path');
var mkdirp = require('mkdirp');
var _ = require('underscore');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var uploadPath = 'public/uploads/modules/';
        mkdirp.sync(uploadPath);
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, req.body.module_id + path.extname(file.originalname));
    }
});

var upload = multer({ storage: storage, limits:{fileSize:1000000} }).single('module_image');

module.exports = {

    index: function (req, res) {
        async.waterfall([
            function(callback) {
                Product.find() .sort('name')
                    .exec(function (err, products) {
                        if (err) {
                            callback(new Error("failed getting something:" + err.message));
                        }
                        else {
                            // res.json({products:products, modules:modules});
                            callback(null, products);
                        }
                    });
            },
            function(products, callback) {
                var prodFilter = 0;
                // console.log(prodFilter);
                // if(typeof products != "undefined" && !_.isNull(products) && products.length > 0){
                //     prodFilter = products[0]._id;
                // }
                var query = (prodFilter == 0) ? Module.find() : Module.find({product: prodFilter});
                
                query.sort('name')
                    .exec(function (err, modules) {
                        if (err) {
                            callback(new Error("failed getting something:" + err.message));
                        }
                        else {
                            callback(null, modules, products);
                        }
                    });
            },
            function(modules, products) {
                // res.json({mod:modules, pro:products});
                res.render('pages/modules/index',
                    {
                        title: 'Modules',
                        modules: modules,
                        products: products,
                        prodFilter: 0
                    });
            }
        ]);
    },

    updateModules: function (req, res) {
        // res.json(req.body);
        var _ids = req.body['_ids[]'];
        var names = req.body['names[]'];
        var order_bys = req.body['order_bys[]'];
        var actives = req.body['actives[]'];
        var describes = req.body['describes[]'];
        var products = req.body['products[]'];
        var len = 1; var saved = 0; var updated = 0;
        var arr = false;
        if(Array.isArray(names)){
            len = names.length;
            arr = true;
        }
        for(var i = 0;  i < len; i++){
            var obj = {
                _id : (arr) ? _ids[i] : _ids,
                name : (arr) ? names[i] : names,
                product : (arr) ? products[i] : products,
                describe : (arr) ? describes[i] : describes,
                order_by : (arr) ? order_bys[i] : order_bys,
                active : (arr) ? actives[i] : actives
            };
            if(obj._id == '-1'){
                delete obj._id;
                // (obj.describe == '') ? delete obj.describe : '';
                var module = new Module(obj);
                module.save(function (err,data) {
                    if(err){
                        req.flash('error','Problem retrieving Modules, try again!');
                    }
                });
                saved++;

            }else{
                Module.update({_id: obj._id}, obj, {upsert: true,  setDefaultsOnInsert: true}, function (err, data) {
                    if(err){
                        req.flash('error','Problem retrieving Modules, try again!');
                    }
                });
                updated++;
            }
        }
        req.flash('success', 'Successfully Executed!!! created:' + saved + ', updated:' + updated);
        res.redirect('modules');
    },

    deleteModule: function (req, res) {
        Module.findOne({_id: req.params.module_id})
            .exec(function (err, module) {
                if (err) {
                    var error = helper.transformToError({code: 503, message: "Error in server interaction"}).toCustom();
                    req.flash('error','Problem retrieving module, try again!');
                    res.json({error:'Error oh'});
                }
                else {
                    var success = helper.transformToError({code: 200, message: "Delete Successfully"}).toCustom();
                    Module.remove({_id:module._id})
                        .exec(function (err, modu) {
                            if(err) {
                                req.flash('danger','Problem retrieving module, try again!');
                            }else {
                                req.flash('success','Successfully Executed!!! ' + module.name + ' deleted');
                                res.json({success: success});
                            }
                        });
                }
            });
    },

    imageUpload: function (req, res) {
        upload(req, res, function (err) {
            if (err) {
                // An error occurred when uploading
                req.flash('danger', 'Problem uploading module image, try again!' + err);
                console.log(err);
                return
            }
            // Everything went fine
            // res.json({body:req.body, file:req.file});
            Module.findOne({_id: req.body.module_id})
                .exec(function (err, module) {
                    if (err) {
                        req.flash('danger','Problem retrieving module, try again!');
                        res.render('pages/modules/index',
                            {
                                title: 'Modules',
                                error: error
                            });
                    }
                    else {
                        var obj = {
                            _id : req.body.module_id,
                            image_url : req.file.path.substring(_.indexOf(req.file.path, '/'))
                        };
                        Module.update({_id: obj._id}, obj, {upsert: true,  setDefaultsOnInsert: true}, function (err, data) {
                            if(err) {
                                req.flash('danger','Problem updating Modules Image, try again!')
                            }else {
                                req.flash('success','Successfully Executed!!! ' + module.name + ' image was uploaded');
                                res.redirect('/modules');
                            }
                        });
                    }
                });
        })
    },

    filterProduct: function (req, res) {
        async.waterfall([
            function(callback) {
                var prodFilter = req.body.product;
                var query = (prodFilter == 0) ? Module.find() : Module.find({product: prodFilter});
                
                query.sort('name')
                .exec(function (err, modules) {
                    if (err) {
                        callback(new Error("failed getting something:" + err.message));
                    }
                    else {
                        callback(null, modules, prodFilter);
                    }
                });
            },
            function(modules, prodFilter, callback) {
                Product.find() 
                    .sort('name')
                    .exec(function (err, products) {
                        if (err) {
                            callback(new Error("failed getting something:" + err.message));
                        }
                        else {
                            // res.json({products:products, modules:modules});
                            callback(null, products, modules, prodFilter);
                        }
                    });
            },
            function(products, modules, prodFilter) {
                // res.json({mod:modules, pro:products});
                res.render('pages/modules/index',
                    {
                        title: 'Modules',
                        modules: modules,
                        products: products,
                        prodFilter: prodFilter
                    });
            }
        ]);
    }
};
