const mongoose = require('mongoose')
const CommentSchema = new mongoose.Schema({
    post_id:{
        type:String,
        require:true
    },
    comment_by:{
        type:String,
        require:true
    },
    content:{
        type:String,
        required:true
    }

})
module.exports = mongoose.model("Comment", CommentSchema)