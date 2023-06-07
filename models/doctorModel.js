const mongoose = require('mongoose');
const doctorSchema = new mongoose.Schema({
    userId:{
        type:String,
    },
    firstName:{
        type:String,
        required:[
            true, 'first name is required'
        ]
    },
    lastName:{
        type:String,
        required:[
            true, 'last name is required'
        ]
    },
    phone:{
        type:String,
        required:[true, 'mobile number is require']
    },
    email:{
        type:String,
        required:[true, 'email is required']
    },
    website:{
        type:String,        
    },
    address:{
        type:String,
        required:[true,'address is required' ]
    },
    specialization:{
        type:String,
        required:[true, 'specialization is required']
    },
    exprience:{
        type:String,
        required:[true, 'exprience is required']
    },
    feesperCunsaltation:{
        type:String,
        required:[true, 'fee is required']
    },
    status:{
        type:String,
        default:"pending",
    },
    timing:{
        type:Object,
        required:[true, 'work timing is required']
    },
},
{timestamps:true}

)




const doctorModel = mongoose.model('doctors', doctorSchema)

module.exports = doctorModel;