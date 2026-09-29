import mongoose from "mongoose";

const needSchema= new mongoose.Schema({
    schoolId:{
            type: Schema.Types.ObjectId,
            ref: "School"
    },
    itemName:{
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
        default:1
    },
    estimatedCost:{
        type:Number,
        required:true,
    },
    description:{
        type:String,
    },
    status:{
        type:String,
        enum:["pending","partially_funded","fully_funded","fulfilled"],
        default:"pending"
    },

    
    
})

export const Need= mongoose.model("Need",needSchema);