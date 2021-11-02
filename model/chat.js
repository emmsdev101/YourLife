const mongoose = require('mongoose')
const ChatSchema = new mongoose.Schema({
    room_id:{
        type:String,
        require:true
    },
    sender:{
        type:String,
        require:true
    },
    content:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:false
    },
    type:{
        type:String,
        default:'chat'
    },
    details:{
        user_id:String,
        message:String
    }

},{timestamps:true})
module.exports = mongoose.model("Chat", ChatSchema)