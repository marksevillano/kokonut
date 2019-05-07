const express = require('express');
const privateRouter = require('./private');
const publicRouter = require('./public');

const router = express.Router();

router.use('/', privateRouter);
router.use('/', publicRouter);

module.exports = router;