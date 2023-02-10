const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');

router.get('/', auth, multer, sauceCtrl.getAllSauces);
router.get('/:id', auth, multer, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.delete('/:id', auth, multer, sauceCtrl.deleteSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.post('/:id/like', auth, multer, sauceCtrl.likeSauce);

module.exports = router;