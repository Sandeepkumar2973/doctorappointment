const userModel = require("../models/UserModels");
const appointmentModel = require("../models/appointmentModel");
const doctorModel = require("../models/doctorModel");


const getDoctorInfoCtrl = async (req, res)  =>{

    try {
        const doctor = await doctorModel.findOne({userId:req.body.userId})
        res.status(200).send({
            success:true,
            message: 'doctor data fetch success',
            data:doctor,
        });
        // console.log(doctor);

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'error in fetching doctor Details'
        })
    }
};

const updateProfileContlr = async(req, res) =>{
    try {
        const doctor = await doctorModel.findOneAndUpdate({userId:req.body.userId}, req.body)
        res.status(201).send({
            success:true,
            message:'doctor profile is updated',
            data:doctor,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'doctor profile updated issue',
            error
        })
    }

}

const getDoctrByIdContlr = async(req, res) =>{
    try {
        const doctor = await doctorModel.findOne({_id:req.body.doctorId})
        res.status(200).send({
            success:true,
            message:'Single doc info fetch',
            data:doctor,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error in single doctor info'
        })
    }
}

const doctorAppointmentctrl = async(req, res) =>{
    try {
        const doctor = await doctorModel.findOne(
            {userId:req.body.userId});
        const Appointments =await appointmentModel.find(
            {doctorId:doctor._id});
        res.status(200).send({
            success: true,
            message:'doctor Appointment fetched success fully',
            data:Appointments,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error in doctor appoint ment',
        })
    }
}
 // status update
 const updateStatusCntrl = async(req, res) =>{
    try {
        const {appointmentsId, status} = req.body
        const appointments = await appointmentModel.findByIdAndUpdate(appointmentsId, {status})
        const user = await userModel.findOne({
            _id: appointments.userId
        });
        user.notification.push({
            type:'status Updated',
            message:`appointment status is updated${status}`,
            onclickPath:'/doctorAppointments'
        });
        await user.save();
        res.status(200).send({
            success: true,
            message: 'Appointment status updated',
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error in update status',
        })
    }
 }
module.exports = {getDoctorInfoCtrl , updateProfileContlr, 
    getDoctrByIdContlr, doctorAppointmentctrl, updateStatusCntrl};