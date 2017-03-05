/**
 * Created by Emmanuel on 8/30/2016.
 */

var UserType = require('../../models/user-type');
var helper = require('../../utils/helper');
module.exports = {
    index: function (req, res) {

        UserType.find()
            // .sort('-createdAt')
            .sort('name')
            .exec(function (err, userTypes) {
                if (err) {
                    var error = helper.transformToError({code: 503, message: "Error in server interaction"}).toCustom();
                    req.flash('error','Problem retrieving user types, try again!');
                    res.render('pages/user/user-types',
                        {
                            title: 'User Types',
                            error: error
                        });
                }
                else {
                    res.render('pages/user/user-types',
                        {
                            title: 'User Types',
                            userTypes: userTypes
                        });
                }
            });
    },
    updateUserTypes: function (req, res) {
        var _ids = req.body['_ids[]'];
        var names = req.body['names[]'];
        var len = 1;
        var arr = false;
        // res.json(req.body);
        if(Array.isArray(names)){
            len = names.length;
            arr = true;
        }
        for(var i = 0;  i < len; i++){
            var obj = {
                name : (arr) ? names[i] : names,
                _id : (arr) ? _ids[i] : _ids
            };
            if(obj._id == '-1'){
                delete obj._id;
                var userType = new UserType(obj);
                userType.save(function (err,data) {
                    if(err){
                        req.flash('error','Problem retrieving user types, try again!');
                    }
                });
        
            }else{
                UserType.update({_id: obj._id}, obj, {upsert: true,  setDefaultsOnInsert: true}, function (err, data) {
                    if(err){
                        req.flash('error','Problem retrieving user types, try again!');
                    }
                });
            }
        }

        res.redirect('user-types');
    },

    deleteUserTypes: function (req, res) {
        UserType.findOne({_id: req.params.user_type_id})
            .exec(function (err, userType) {
                if (err) {
                    var error = helper.transformToError({code: 503, message: "Error in server interaction"}).toCustom();
                    req.flash('error','Problem retrieving user types, try again!');
                    res.json({error:'Error oh'});
                }
                else {
                    var success = helper.transformToError({code: 200, message: "Delete Successfully"}).toCustom();
                    UserType.remove({_id:userType._id})
                        .exec(function (err, userType) {
                            if (err) {
                                req.flash('error','Problem retrieving user types, try again!');
                                res.json({error:'Error oh'});
                            }
                            else {
                                res.json({message:success});
                            }
                        });
                }
            });
        // console.log(req.params);
        // res.redirect('user-types');
    }
};
