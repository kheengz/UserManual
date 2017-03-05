var HomeController = require('../controllers/home');
var ModuleController = require('../controllers/admin/modulesController');
var ProductController = require('../controllers/admin/productsController');
var UserTypesController = require('../controllers/admin/user-types');
var StepController = require('../controllers/admin/stepsController');
var TaskController = require('../controllers/admin/tasksController');

/* All pages routes. */
module.exports = function (router) {
    /* Home page. */
    router.get('/', HomeController.index);


    /* product pagess */
    router.get('/products', ProductController.index);
    router.post('/products', ProductController.updateProducts);
    router.post('/products/image', ProductController.imageUpload);
    router.delete('/products/:product_id', ProductController.deleteProduct);
    
    /* module pages. */
    router.get('/modules', ModuleController.index);
    router.post('/modules', ModuleController.updateModules);
    router.get('/modules/product', ModuleController.index);
    router.post('/modules/product', ModuleController.filterProduct);
    router.post('/modules/image', ModuleController.imageUpload);
    router.delete('/modules/:module_id', ModuleController.deleteModule);


    /* user type pages. */
    router.get('/user-types', UserTypesController.index);
    router.post('/user-types', UserTypesController.updateUserTypes);
    router.delete('/user-types/:user_type_id', UserTypesController.deleteUserTypes);

    /* task pages. */
    router.get('/tasks', TaskController.index);
    router.get('/tasks/create', TaskController.create);
    router.post('/tasks/create', TaskController.save);
    router.get('/tasks/edit/:task_id', TaskController.edit);
    router.post('/tasks/edit/:task_id', TaskController.update);
    router.delete('/tasks/:task_id', TaskController.deleteTask);
    router.get('/tasks/:task_id', TaskController.show);
    router.get('/tasks/steps/:task_id', TaskController.steps);
    router.get('/tasks/module', TaskController.index);
    router.post('/tasks/module', TaskController.filterModule);

    /* step pages. */
    router.get('/steps/:task_id', StepController.index);
    router.post('/steps/:task_id', StepController.save);
    router.get('/steps/edit/:step_id', StepController.edit);
    router.post('/steps/edit/:step_id', StepController.update);
    router.delete('/steps/:step_id', StepController.delete);
};