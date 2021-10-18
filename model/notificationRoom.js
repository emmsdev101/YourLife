const mongoose = require('mongoose')
const NotificationRoomSchema = new mongoose.Schema({
    post_id:{
        type:String,
        require:true
    },
    recipients:[],
    type:String,
    owner:String
},{timestamps:true})
module.exports = mongoose.model("NotificationRoom", NotificationRoomSchema)