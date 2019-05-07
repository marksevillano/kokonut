const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth');
const user = require('../controllers/user');
const validate = require('express-validation');
const authValidation = require('../validations/auth')
const signUp = require('../validations/signup')

router.route('/auth/login').post(validate(authValidation.loginParam), auth.login);
router.route('/user').post(validate(signUp.signUpParam), user.signUp);

module.exports = router;