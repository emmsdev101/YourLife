const mongoose = require('mongoose')
const LikedSchema = new mongoose.Schema({
    post_id:{
        type:String,
        require:true
    },
    liked_by:{
        type:String,
        require:true
    }

})
module.exports = mongoose.model("Liked", LikedSchema)