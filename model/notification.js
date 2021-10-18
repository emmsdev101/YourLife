const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
    post_id:{
        type:String,
        require:true
    },
    type:{
        type:String,
        require:true
    },
    last_activity:String,
    user_id:String,
    date_commented:String,
    seen:Boolean,
},{timestamps:true})
module.exports = mongoose.model("Notification", NotificationSchema)