const express = require('express');
const validate = require('express-validation');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const auth = require('../controllers/auth');
const action = require('../controllers/action');
const actionVal = require('../validations/action') 

router.get('/auth/me', authenticate, auth.me);

router.get('/v1/action', [authorize], action.retrieveActions);

router.get('/v1/action/:id', [authorize], action.findAction);

router.post('/v1/action', [authorize, validate(actionVal.actionParam)], action.addAction);

router.put('/v1/action/:id', [authorize, validate(actionVal.actionParam)], action.updateAction);

router.delete('/v1/action/:id', authorize, action.deleteAction);

module.exports = router;