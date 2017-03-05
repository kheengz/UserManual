/**
 * Created by Kheengz on 8/30/2016.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ModuleSchema = new Schema({
    name: {type:String, required: true},
    describe: {type:String},
    image_url: {type:String},
    order_by: {type:Number},
    active : { type: Boolean, default: true},
    product : {type: Schema.Types.ObjectId, ref: 'Product'}
},{
    timestamps: true
});

ModuleSchema.statics.rules = function() {
    return {
        name : 'required',
        order_by : 'required',
        active : 'required',
        product : 'required'
    }
};

ModuleSchema.post('save', function(doc) {
    console.log('%s has been saved', doc._id);
});

ModuleSchema.post('remove', function(doc) {
    console.log('%s has been removed', doc._id);
});
module.exports = mongoose.model('Module', ModuleSchema);
