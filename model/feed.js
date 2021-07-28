const mongoose = require('mongoose')
const feedsSchema = new mongoose.Schema({
    post_id:{
        type:String,
        requrie:true
    },
    user_id:{
        type:String,
        required:true
    },
    data:{
        type:String,
        default:Date.now
    }
})