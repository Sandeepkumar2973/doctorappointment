const userModel = require('../models/UserModels');
const  bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const doctorModel = require('../models/doctorModel');
const appointmentModel = require('../models/appointmentModel');
const moment = require('moment');

//register callback-----
const registerController = async (req,res) =>{
    try {
        const existUser = await userModel.findOne({email:req.body.email});
        if(existUser){
            return res.status(200).send({
                message:'user Already exist', 
                success:false
            })
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password, salt)
        req.body.password = hashedPass
        const newUser = new userModel(req.body)
        await newUser.save();
        res.status(201).send({
            message:'Register SuccessFully', success:true
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false, 
            message:`Register Controller${error.message}`});
        }

}

//login-==========-=-=-==-
const loginController = async(req, res) =>{
    try {
        const user = await userModel.findOne({email:req.body.email});
        if(!user){
            return res.status(200).send({
                message:'user not found', 
                success:false
            })
        }
        const isMtch = await bcrypt.compare(req.body.password, user.password)
        if(!isMtch){
            return res.status(200)
            .send({
                message:'Invalid Email Or Password', 
                success:false
            })
        }
        const token = jwt.sign({id : user._id},
             process.env.JWT_SECRET,
              {expiresIn: '1d'})
            res.status(200)
            .send({
                message:'login Success',
                success:true,
                token
            })
    } catch (error) {
        console.log(error)
        res.status(500)
        .send({
            success:false, 
            message:`Error in login Controller${error.message}`});
    }
};



const authController = async (req, res) =>{
    try {
        const user = await userModel.findById({_id:req.body.userId})
        user.password = undefined;
        if(!user){
            return res.status(200).send({
                message:'user not found any',
                success:false
            })
        }else{
            res.status(200).send({
                success:true,
                data:user
            });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message:"auth error",
            success:false,
            error 
        });
    }
};
// apply doctor 
const ApplyDoctorController =async(req, res) =>{
    try {
        const newDoctor = await doctorModel({...req.body, status:'pending'})
        await newDoctor.save()
        const adminUser = await userModel.findOne({isAdmin:true})
        const notification = adminUser.notification
        notification.push({
            type:'apply-doctor-request',
            message: `${newDoctor.firstName} ${newDoctor.lastName} Has applied for a Doctor Account`,
            data:{
                doctorId:newDoctor._id,
                name:newDoctor.firstName + " " + newDoctor.lastName,
                onclickPath:'admin/doctors'
            }
        })
        await userModel.findByIdAndUpdate(adminUser._id, {notification})
        res.status(201).send({
            success:true,
            message:'Doctor Account Applied success',
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error where apply for doctor'
        })
    }
}

//notifications controller===
const getAllNotificationController = async (req, res) =>{
    try {
        const user = await userModel.findOne({_id:req.body.userId})
        const seennotification = user.seennotification
        const notification = user.notification
        seennotification.push(...notification)
        user.notification =[]
        user.seennotification = notification
        const updatedUser = await user.save()
        res.status(200).send({
            success:true,
            message:'all notification marked as reed',
            data:updatedUser,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message:'Error in notification',
            success:false,
            error
        })
    }

}
const deleteAllNotificationController = async(req, res) =>{

    try {
        const user = await userModel.findOne({_id:req.body.userId})
        user.notification = []
        user.seennotification = []
        const updateUser = await user.save()
        updateUser.password = undefined;
        res.status(200).send({
            success: true,
            message:'notification delete successfully',
            data:updateUser,
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'unable to delete all notifications',
            error
        })
    }
}

//get all doctor=========
const getAllDoctorsCntrlr = async (req, res) =>{
    try {
        const doctors = await doctorModel.find({status:'approved'})
        res.status(200).send({
            success: true,
            message: 'doctors data list fetched ',
            data: doctors,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error while getting doctors data',
            error
        })
    }

}
const bookAppointMentctrl =async (req , res) =>{
    try {
        // req.body.date = moment(req.body.date,'DD-MM-YYYY').toISOString();
        // req.body.time = moment(req.body.time,"HH:mm").toISOString();
        req.body.status = 'pending'
        const newAppointment = new appointmentModel(req.body)
        await newAppointment.save()
        const user = await userModel.findOne({_id: req.body.userId})
        user.notification.push({
            type:'New-appointment-request',
            message:`A new Appointment Request from ${req.body.userInfo.name}`,
            onclickPath:'/user/appointments'
        })
        await user.save();
        res.status(200).send({
            success:true,
            message: 'Appointment book successFully',
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error while booking appointment',
            error
        }) 
    }

}
const bookingAvailablitycntrl = async (req, res) =>{
    try {
        const date = moment(req.body.date, "DD-MM-YYYY").toISOString();

        const fromTime  = moment(req.body.time, "HH:mm").subtract(1 , "hours").toISOString();
        const toTime  = moment(req.body.time, "HH:mm").add(1 , "hours").toISOString();

        const doctorId = req.body.doctorId;
        const appointments = await appointmentModel.find({
            doctorId, date, time: {
                $gte: fromTime,
                $lte: toTime,
            },
        });
        if(appointments.length > 0){
            return res.status(200).send({
                message: "Appointment not available this time",
                success:true,
            })
        }else{
            return res.status(200).send({
                success:true,
                message: "Appointment  Is available",
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error In booking ',
            error
        }) 
    }
}
const userAppointmentListcntlr = async(req, res) =>{
    try {
        const appointments = await appointmentModel.find({
            userId:req.body.userId
        })
        res.status(200).send({
            success:true,
            message:'Users Appointment fetched Successfully',
            data:appointments,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error In user Appointment List ',
            error
        })
    }
}
module.exports = {loginController, registerController, 
    authController, ApplyDoctorController, getAllNotificationController,
     deleteAllNotificationController,getAllDoctorsCntrlr, 
     bookAppointMentctrl , bookingAvailablitycntrl, userAppointmentListcntlr};