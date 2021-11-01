const mongoose = require('mongoose')
const participant = new mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },
    seen:{
        type:Boolean,
        default:false
    }
},{timestamps:true})
const ChatRoomSchema = new mongoose.Schema({
    name:{
        type:String,
        requried:false
    },
    photo:{
        type:String,
        required:false
    },
    isgroup:{
        type:Boolean,
        default:false
    },
    last_sender:{
        user_id:String,
        message:String,
        date:{
            type:Date,
            default:Date.now
        }
    },
    participants:[participant],

},{timestamps:true})
module.exports = mongoose.model("ChatRoom", ChatRoomSchema)