/**
 * Created by Kheengz on 8/30/2016.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StepSchema = new Schema({
    describe: {type:String},
    image_url: {type:String},
    order_by: {type:Number},
    active : { type: Boolean, default: true},
    task : {type: Schema.Types.ObjectId, ref: 'Task'},    
},{
    timestamps: true
});

StepSchema.statics.rules = function() {
    return {
        describe : 'required',
        task : 'required',
        order_by : 'required'
    }
};

StepSchema.post('save', function(doc) {
    console.log('%s has been saved', doc._id);
});

StepSchema.post('remove', function(doc) {
    console.log('%s has been removed', doc._id);
});
module.exports = mongoose.model('Step', StepSchema);
