/**
 * Created by Ekaruztech on 7/18/2016.
 */
var config = require('config');
var Q = require('q');
var _ = require('underscore');

exports.generateOTCode = function()
{
        var nums = [0,1,2,3,4,5,6,7,8,9],
            selections = "",
            numPicks = 6;
        // randomly pick one from the array
        for (var i = 0; i < numPicks; i++) {
            var index = Math.floor(Math.random() * nums.length);
            selections +=nums[index];
            nums.splice(index, 1);
        }
        return selections;
};

exports.transformToError = function (errorObj) {
    var err = new Error();
    err.toCustom = function () {
        this.custom = true;
        return this;
    };
    _.extend(err,errorObj);
    return err;
};

exports.validationErrorsToArray = function (error) {
    var errorsArray = [];
    if(!_.isEmpty(error))
    {
        for(var prop in error)
        {
            if(error.hasOwnProperty(prop))
            {
                _.forEach(error[prop],function (errorMessage) {
                    errorsArray.push(errorMessage);
                });
            }
        }
    }

    return errorsArray;
};

// exports.errNullObjectErrorHandler = function (req, res, data) {
//     if (data.err) {
//         req.flash('danger','Problem retrieving record, try again!');
//         // return res.redirect(data.route);
//     }
//     if(_.isNull(data.obj)){
//         req.flash('danger','Invalid Record Request!!!!');
//     }  
//     return res.redirect(data.route);
// };
//
