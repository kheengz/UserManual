/**
 * Created by Emmanuel on 8/30/2016.
 */
var Module = require('../../models/module');

module.exports = {
    
    modules: function (req, res) {

        Module.find({product: req.params.product_id})
            .sort('name')
            .exec(function (err, modules) {
                if (err) {
                    req.flash('error','Problem retrieving products, try again!');
                }
                if (!modules) {
                    modules = {};
                }
                res.render('partials/modules',
                    {
                        modules: modules
                    });
            });
    }
};

