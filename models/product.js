/**
 * Created by Kheengz on 8/30/2016.
 */

var Module = require('./module');
var async = require('async');
var modules = {};

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProductSchema = new Schema({
    name: {type:String, required: true},
    describe: {type:String},
    image_url: {type:String},
    order_by: {type:Number},
    active : { type: Boolean, default: true}
},{
    timestamps: true
});

//TODO one to many relationships
ProductSchema.methods.modules = function () {
    var _id = this._id;
    async.waterfall([
        function(callback) {
            Module.find({product: _id})
                .exec(function (err, mod) {
                    if(err){
                        callback(new Error("failed getting something:" + err.message));
                    }else {
                        modules = mod;
                        // callback(null, modules);
                    }
                });
        }
    ]);
    return modules;
};

ProductSchema.post('save', function(doc) {
    console.log('%s has been saved', doc._id);
});

ProductSchema.post('remove', function(doc) {
    console.log('%s has been removed', doc._id);
});
module.exports = mongoose.model('Product', ProductSchema);
