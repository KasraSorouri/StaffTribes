const router  = require('express').Router();
const userController = require('../controllers/userController');

// get all users
router.get('/', userController.getAllUsers);

// get a user
router.get('/:id', userController.getUser);

// create a user
router.post('/', userController.createUser);

// edit a user
router.put('/:id', userController.editUser);

// get a user availability
router.get('/availability/:id', userController.getUserAvailability);

// set a user availability
router.put('/availability/:id', userController.setUserAvailability);

// get a user friends availibility
router.get('/friends/availability/:id', userController.getUserFriendsAvailability);

module.exports = router;