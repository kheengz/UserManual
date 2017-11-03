/**
 * Created by Emmanuel on 8/30/2016.
 */

var Task = require('../../models/task');
var Step = require('../../models/step');
var Product = require('../../models/product');
var Module = require('../../models/module');
var helper = require('../../utils/helper');
var async = require('async');
var _ = require('underscore');

module.exports = {

    index: function (req, res) {
        async.waterfall([
            function(callback) {
                Product.find()
                    .sort('name')
                    .exec(function (err, products) {
                        (err)
                            ? callback(new Error("failed getting something:" + err.message))
                            : callback(null, products);
                    });
            },
            function(products, callback) {
                var modFilter = 0;
                // if(typeof modules != "undefined" && !_.isNull(modules) && modules.length > 0){
                //     modFilter = modules[0]._id;
                // }
                var query = (modFilter == 0) ? Task.find() : Task.find({module: modFilter});
                
                query.sort('name')
                    .populate('product', 'name')
                    .populate('module', 'name')
                    .exec(function (err, tasks) {
                        if (err) {
                            callback(new Error("failed getting something:" + err.message));
                        }
                        else {
                            // res.json(tasks);
                            res.render('pages/tasks/index',
                                {
                                    title: 'Tasks',
                                    tasks: tasks,
                                    products: products,
                                    modFilter: modFilter,
                                    prodFilter: ''
                                });
                        }
                    });
            }
        ]);
    },

    create: function (req, res) {
        Product.find().sort('name').exec(function (err, products) {
            if (err) {
                req.flash('error','Problem retrieving Tasks, try again!');
                res.render('pages/tasks/create',
                    {
                        title: 'Create Task',
                    });
            }
            else {
                res.render('pages/tasks/create',
                    {
                        title: 'Create Task',
                        products: products
                    });
            }
        });
    },

    save: function (req, res) {
        var obj = {
            name : req.body['name'],
            describe : req.body['describe'],
            order_by : req.body['order_by'],
            product : req.body['product'],
            module : req.body['module']
        };
        
        var task = new Task(obj);
        task.save(function (err,data) {
            if(err){
                req.flash('danger','Problem saving Task, try again!');
                return res.redirect('/tasks/create');
            }
        });
        
        req.flash('success', 'Successfully Executed!!! Task: ' + task.name + ' was created');
        res.redirect('/tasks');
    },

    show: function (req, res) {
        Task.findOne({_id: req.params.task_id})
            .populate('product', 'name')
            .populate('module', 'name')
            .exec(function (err, task) {
                if (err) {
                    req.flash('danger','Problem retrieving task, try again!');
                    return res.redirect('/tasks');
                }
                if(!task){
                    req.flash('danger','Invalid Task record request!!!!');
                    return res.redirect('/tasks');
                }
                
                res.render('pages/tasks/show',
                    {
                        title: 'Details of a Task',
                        task: task
                    });
            });
    },
    
    edit: function (req, res) {
        async.waterfall([
            function(callback) {
                Task.findOne({_id: req.params.task_id})
                    .exec(function (err, task) {
                        if(err)
                            callback(new Error("failed getting something:" + err.message));
                        else 
                            callback(null, task);
                    });
            },
            function(task, callback) {
                Product.find() .sort('name')
                    .exec(function (err, products) {
                        if(err)
                            callback(new Error("failed getting something:" + err.message));
                        else 
                            callback(null, products, task);
                    });
            },
            function(products, task, callback) {
                Module.find({product: task.product}) .sort('name')
                    .exec(function (err, modules) {
                        if(err) 
                            callback(new Error("failed getting something:" + err.message));
                        else 
                            callback(null, modules, products, task);
                    });
            },
            function(modules, products, task) {
                // res.json({task:task, mod:modules, pro:products});
                res.render('pages/tasks/edit',
                    {
                        title: 'Modify An Existing Task',
                        task: task,
                        modules: modules,
                        products: products
                    });
            }
        ]);
    },

    update: function (req, res) {
        var obj = {
            _id : req.body['_id'],
            name : req.body['name'],
            describe : req.body['describe'],
            order_by : req.body['order_by'],
            product : req.body['product'],
            active : req.body['active'],
            module : req.body['module']
        };

        var task = new Task(obj);
        Task.update({_id: obj._id}, obj, {upsert: true,  setDefaultsOnInsert: true}, function (err, data) {
            if (err) {
                req.flash('danger','Problem retrieving task, try again!' + err.message);
                return res.redirect('/tasks');
            }
        });

        req.flash('success', 'Successfully Executed!!! Task: ' + task.name + ' was updated');
        res.redirect('/tasks');
    },

    deleteTask: function (req, res) {
        Task.findOne({_id: req.params.task_id})
            .exec(function (err, task) {
                if (err) {
                    req.flash('danger','Problem retrieving task, try again!' + err.message);
                    return res.redirect('/tasks');
                }
                if(!task){
                    req.flash('danger','Invalid Task record request!!!!');
                    return res.redirect('/tasks');
                }
                Task.remove({_id:task._id})
                    .exec(function (err, tas) {
                        if(err) {
                            req.flash('danger','Problem retrieving module, try again!');
                        }else {
                            req.flash('success','Successfully Executed!!! ' + task.name + ' deleted');
                            res.json({success: 'Successfully Executed!!! ' + task.name + ' deleted'});
                        }
                    });
            });
    },

    steps: function (req, res) {
        async.waterfall([
            function(callback) {
                Task.findOne({_id: req.params.task_id})
                    .exec(function (err, task) {
                        if (err) {
                            req.flash('danger','Problem retrieving task, try again!' + err.message);
                            return res.redirect('/tasks');
                        }
                        if(!task){
                            req.flash('danger','Invalid Task record request!!!!');
                            return res.redirect('/tasks');
                        }
                        callback(null, task);
                    });
            },
            function(task, callback) {
                Step.find({task: req.params.task_id}) 
                    .sort('order_by')
                    .populate('task', 'name')
                    .exec(function (err, steps) {
                        (err)
                            ? callback(new Error("failed getting something:" + err.message))
                            : callback(null, steps, task);
                    });
            },
            function(steps, task) {
                res.render('pages/tasks/steps',
                    {
                        title: 'Task Steps',
                        steps: steps,
                        task: task
                    });
            }
        ]);
    },

    filterModule: function (req, res) {
        async.waterfall([
            function(callback) {
                Product.find()
                    .sort('name')
                    .exec(function (err, products) {
                        (err)
                            ? callback(new Error("failed getting something:" + err.message))
                            : callback(null, products);
                    });
            },
            function(products, callback) {
                Module.find({product: req.body.product})
                    .sort('name')
                    // .populate('product', 'name')
                    .exec(function (err, modules) {
                        (err)
                            ? callback(new Error("failed getting something:" + err.message))
                            : callback(null, modules, products);
                    });
            },
            function(modules, products, callback) {
                var modFilter = req.body.module;
                var query = (modFilter == 0 || modFilter == '') ? Task.find() : Task.find({module: modFilter});
                //TODO :: filter the tasks by modules present in the product
                query.sort('name')
                    .populate('product', 'name')
                    .populate('module', 'name')
                    .exec(function (err, tasks) {
                        (err)
                            ? callback(new Error("failed getting something:" + err.message))
                            : callback(null, tasks, modFilter, modules, products);
                    });
            },
            function(tasks, modFilter, modules, products) {
                res.render('pages/tasks/index',
                    {
                        title: 'Tasks',
                        tasks: tasks,
                        modules: modules,
                        products: products,
                        modFilter: modFilter,
                        prodFilter: req.body.product
                    });
            },
        ]);
    },
};
