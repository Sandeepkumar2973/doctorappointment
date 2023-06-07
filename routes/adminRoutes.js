const express = require('express')

const authMiddleware = require('../middlewares/authMiddleware');
const  {getAllUsersContrlr, getAllDoctorsContrlr, changeAccountStatusCntlr} = require('../controllers/adminCtlrl');


const router = express.Router();


// get methode || users====
router.get('/getAllUsers', authMiddleware, getAllUsersContrlr);


// get method || Doctors====

router.get('/getAllDoctors', authMiddleware, getAllDoctorsContrlr);


//post method=====
router.post('/changeAccountStatus', authMiddleware, changeAccountStatusCntlr);
module.exports = router;