const mongoose = require('mongoose');

const jobschema = new mongoose.Schema({
    company:{
        type:String,
        required:[true,'please provide company name'],
        maxlength:50
    },
    position:{
        type:String,
        required:[true,'please provide position'],
        maxlength:100
    },
    status:{
        type:String,
        enum:['interview','declined','pending'],
        default:'pending'
    },
    createdby:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true,'please provide user'],
    }
},{timestamps:true})


module.exports = mongoose.model('job',jobschema);