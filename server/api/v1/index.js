'use strict';

const Router = require('koa-router');

const file = require('./file');

const router = new Router();

router.use('/file', file.routes(), file.allowedMethods());

module.exports = router;
