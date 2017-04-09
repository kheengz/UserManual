/**
 * Created by Emmanuel on 8/30/2016.
 */

var Task = require('../../models/task');
var Step = require('../../models/step');
var async = require('async');
var multer  = require('multer');
var helper = require('../../utils/helper');
var path = require('path');
var mkdirp = require('mkdirp');
var _ = require('underscore');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var uploadPath = 'public/uploads/steps/';
        mkdirp.sync(uploadPath);
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({ storage: storage, limits:{fileSize:1000000} }).single('image_url');

module.exports = {

    index: function (req, res) {
        async.waterfall([
            function(callback) {
                Task.findOne({_id: req.params.task_id})
                    .exec(function (err, task) {
                        // var data = {err:err, obj:task, route:'/tasks'};
                        // helper.errNullObjectErrorHandler(req, res, data);
                        if(err){
                            req.flash('danger','Problem retrieving Task, try again!'+ err.message);
                            return res.redirect('/tasks');
                        }
                        if(!task){
                            req.flash('danger','Invalid Task record you are requesting for!!!!');
                            return res.redirect('/tasks');
                        }
                        
                        callback(null, task);
                    });
            },
            function(task, callback) {
                Step.find({task: req.params.task_id}) .sort('order_by')
                    .populate('task', 'name')
                    .exec(function (err, steps) {
                        (err)
                            ? callback(new Error("failed getting something:" + err.message))
                            : callback(null, steps, task);
                    });
            },
            function(steps, task) {
                res.render('pages/steps/index',
                    {
                        title: 'Task Steps',
                        steps: steps,
                        task: task
                    });
            }
        ]);
    },

    save: function (req, res) {
        upload(req, res, function (err) {
            // res.json(req.body);
            if (err) {
                // An error occurred when uploading
                req.flash('danger', 'Problem uploading module image, try again!' + err.message);
                console.log(err);
                return
            }
            // Everything went fine
            var obj = {
                describe : req.body['describe'],
                order_by : req.body['order_by'],
                task : req.body['task'],
            };
            var step = new Step(obj);
            step.save(function (err, data) {
                if(err){
                    req.flash('error','Problem retrieving Modules, try again!'+ err.message);
                }else {
                    if(typeof req.file != 'undefined'){
                        var obj = {
                            _id : step._id,
                            image_url : req.file.path.substring(_.indexOf(req.file.path, '/'))
                        };
                        Step.update({_id: obj._id}, obj, {upsert: true,  setDefaultsOnInsert: true}, function (err, data) {
                            if(err)
                                req.flash('danger','Problem updating Modules Image, try again!')
                        });
                        req.flash('success','image was uploaded and ');
                    }
                    req.flash('success','Successfully Executed!!! step created.');
                    res.redirect('/steps/'+step.task);
                }
                
            });
        });
    },

    edit: function (req, res) {
        async.waterfall([
            function(callback) {
                Step.findOne({_id: req.params.step_id})
                    .sort('order_by')
                    .populate('task', 'name')
                    .exec(function (err, step) {
                        if(err){
                            req.flash('danger','Problem retrieving Step, try again!'+ err.message);
                            return res.redirect('/tasks');
                        }
                        if(!step){
                            req.flash('danger','Invalid Step record you are requesting for!!!!');
                            return res.redirect('/tasks');
                        }
                        callback(null, step);
                    });
            },
            function(step, callback) {
                // res.json(step); //_.isNull(step)
                Step.find({task: step.task})
                    .sort('order_by')
                    .populate('task', 'name')
                    .exec(function (err, steps) {
                        (err)
                            ? callback(new Error("failed getting something:" + err.message))
                            : callback(null, steps, step);
                    });
            },
            function(steps, step) {
                res.render('pages/steps/edit',
                    {
                        title: 'Edit Task Steps',
                        steps: steps,
                        step: step
                    });
            }
        ]);
    },

    update: function (req, res) {
        upload(req, res, function (err, next) {
            // res.json(req.body);
            if (err) {
                // An error occurred when uploading
                req.flash('danger', 'Problem uploading step image, try again!' + err.message);
                console.log(err.message);
                return next(err);
            }
            // Everything went fine
            var obj = {
                _id : req.body['step_id'],
                describe : req.body['describe'],
                order_by : req.body['order_by'],
                active : req.body['active'],
                task : req.body['task']
            };

            var step = new Step(obj);
            Step.update({_id: obj._id}, obj, {upsert: true,  setDefaultsOnInsert: true}, function (err, data) {
                if(err){
                    req.flash('danger','Problem updating step, try again!'+ err.message);
                    return res.redirect('/steps/'+step.task);
                }else {
                    // console.log('Step:' + step + ' \n\n Data:' + data);
                    if(typeof req.file != 'undefined'){
                        var obj = {
                            _id : step._id,
                            image_url : req.file.path.substring(_.indexOf(req.file.path, '/'))
                        };
                        Step.update({_id: obj._id}, obj, {upsert: true,  setDefaultsOnInsert: true}, function (err, data) {
                            if(err)
                                req.flash('danger','Problem updating Step Image, try again!')
                        });
                        req.flash('success','image was uploaded and ');
                    }
                    req.flash('success','Successfully Executed!!! step updated.');
                    res.redirect('/steps/'+step.task);
                }

            });
        });
    },
    
    delete: function (req, res) {
        Step.findOne({_id: req.params.step_id})
            .populate('task', 'name')
            .exec(function (err, step, next) {
                if (err) {
                    req.flash('danger','Problem retrieving step!'+ err.message);
                    return res.redirect('/steps/edit/'+req.params.step_id);
                }
                if(!step){
                    req.flash('danger','Invalid Step record request!!!!');
                    return res.redirect('/steps/edit/'+req.params.step_id);
                }

                Step.remove({_id:step._id})
                    .exec(function (err, tas) {
                        if(err) {
                            req.flash('danger','Problem deleting step, try again!' + err.message);
                        }else {
                            req.flash('success','Successfully Executed!!! Deleted');
                            res.json({success: 'Successfully Executed!!! ' + step.task.name + ' deleted'});
                        }
                    });
            });
    }
};
