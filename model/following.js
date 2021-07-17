const mongoose = require('mongoose')
const Following = new mongoose.Schema({
    follower:{
        type: String,
        required: true
    },
    following:{
        type:String,
        required: true
    },
})
module.exports = mongoose.model("Following", Following)