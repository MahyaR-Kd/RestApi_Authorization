const { login, createUser, getUsers, getUserById, updateUser, deleteUser } = require('./user.controller');
const router = require('express').Router();
const { checkToken } = require('../../auth/token_validation')


router.post('/', checkToken, createUser);
router.post('/', checkToken, createUser);
router.get('/', checkToken, getUsers);
router.get('/:id', checkToken, getUserById);
router.patch('/', checkToken, updateUser);
router.delete('/', checkToken, deleteUser);
router.post('/login', login);

module.exports = router;