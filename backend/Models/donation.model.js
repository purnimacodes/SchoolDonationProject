import mongoose from "mongoose";

const donationSchema= new mongoose.Schema({
    donarId:{
         type: Schema.Types.ObjectId,
            ref: "User",
            required:true,
    },
    schoolId:{
         type: Schema.Types.ObjectId,
            ref: "School",
            required:true
    },
    needId:{
         type: Schema.Types.ObjectId,
            ref: "Need"
    },
    amount:{
        type:Number,
        required:true
    },
    razorpayOrderId:{
        type:String,
        required:true
    },
    razorpayPaymentId:{
        type:String,
        required:true
    },
    razorpaySignature:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["pending","collected","disbursed","fulfilled","refunded"],
        default:"pending"
    }
})