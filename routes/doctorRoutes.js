const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const  {getDoctorInfoCtrl, updateProfileContlr, getDoctrByIdContlr, doctorAppointmentctrl, updateStatusCntrl}  = require('../controllers/doctorCtrl');

const router = express.Router();

// get single doctor by user id====

router.post('/getDoctorInfo',authMiddleware, getDoctorInfoCtrl );

//  profile updating of doctor===
router.post('/updateProfile', authMiddleware , updateProfileContlr);


router.post('/getDoctotById', authMiddleware, getDoctrByIdContlr);

router.get('/doctorAppointments', authMiddleware, doctorAppointmentctrl);


//status update routes
router.post('/updateStatus', authMiddleware, updateStatusCntrl);
module.exports = router;