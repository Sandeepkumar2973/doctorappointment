const express = require('express');

const { loginController, registerController, authController,
     ApplyDoctorController , getAllNotificationController, deleteAllNotificationController, 
     getAllDoctorsCntrlr, bookAppointMentctrl, bookingAvailablitycntrl, userAppointmentListcntlr} = require('../controllers/userCtrl');
const authMiddleware = require('../middlewares/authMiddleware');

// router ----
const router =express.Router();


//routes---
//login|| post---

router.post('/login', loginController);

//register || post---
router.post('/register', registerController);

// Auth || Post -            ==-==
router.post('/getUserData', authMiddleware , authController);

//doctor 
router.post('/apply-doctor', authMiddleware , ApplyDoctorController);

//notifications---=-=-=
router.post('/get-all-notification', authMiddleware , getAllNotificationController);
router.post('/delete-all-notification', authMiddleware , deleteAllNotificationController);
router.get('/getAllDoctors', authMiddleware  , getAllDoctorsCntrlr );

// book appointment 
router.post('/book-appointment', authMiddleware, bookAppointMentctrl)

//check availablity
router.post('/availbility', authMiddleware, bookingAvailablitycntrl);

router.get('/appointmentList',authMiddleware, userAppointmentListcntlr)


module.exports = router;