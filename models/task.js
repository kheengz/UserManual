/**
 * Created by Kheengz on 8/30/2016.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TaskSchema = new Schema({
    name: {type:String, required: true},
    describe: {type:String},
    order_by: {type:Number},
    active : { type: Boolean, default: true},
    module : {type: Schema.Types.ObjectId, ref: 'Module'},    
    product : {type: Schema.Types.ObjectId, ref: 'Product'}    
},{
    timestamps: true
});

TaskSchema.statics.rules = function() {
    return {
        name : 'required',
        product : 'required',
        module : 'required',
        order_by : 'required'
    }
};

TaskSchema.post('save', function(doc) {
    console.log('%s has been saved', doc._id);
});

TaskSchema.post('remove', function(doc) {
    console.log('%s has been removed', doc._id);
});
module.exports = mongoose.model('Task', TaskSchema);
