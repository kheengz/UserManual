/* GET user types listing. */
var ListBoxController = require('../controllers/admin/listBoxesController');

module.exports = function (router) {
    
    /* GET module page. */
    router.get('/list-box/modules/:product_id', ListBoxController.modules);
};
