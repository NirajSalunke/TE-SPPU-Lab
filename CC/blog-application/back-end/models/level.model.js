import mongoose from "mongoose";


const levelSchema = new mongoose.Schema({
    levelName:{
        type:String,
        default: "Beginner"
    },
    levelProgress:{
        type:Number,
        default:0,
    },
    levelTotalNumber:{
        type:Number,
        default:100
    },
    authorId:{
        type: mongoose.Schema.Types.ObjectId ,
        ref: 'User'
    },
    achievedOn:{
        type:Date,
        default: Date.now,
        required: true
    }
}, {timestamps:true})

const Level = mongoose.model("Level", levelSchema);

export {Level}