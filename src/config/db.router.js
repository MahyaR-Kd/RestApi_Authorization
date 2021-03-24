const router = require('express').Router();
const { db_bild } = require('./db.controller');


router.post('/', db_bild);

module.exports = router;