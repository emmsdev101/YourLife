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
    date_posted:{
        type:Date,
        required:true
    }
    ,owner_id:{
        type:String,
        required:true
    },
    photos:{
        type:Array,
        required:false
    },
    content:{
        type:String,
        required:false
    }
},{timestamps:true})
module.exports = mongoose.model("FeedsSchema", feedsSchema)