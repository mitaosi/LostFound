const express = require('express');
const router = express.Router();
const lostitems = require('../controllers/lostitems');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateLostitem } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Lostitem = require('../models/lostitem');

router.route('/')
    .get(catchAsync(lostitems.index))
    .post(isLoggedIn, upload.array('image'), validateLostitem, catchAsync(lostitems.createLostitem))

router.get('/new', isLoggedIn, lostitems.renderNewForm)

router.route('/:id')
    .get(catchAsync(lostitems.showLostitem))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateLostitem, catchAsync(lostitems.updateLostitem))
    .delete(isLoggedIn, isAuthor, catchAsync(lostitems.deleteLostitem));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(lostitems.renderEditForm))



module.exports = router;