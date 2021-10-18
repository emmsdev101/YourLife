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
    commentor_id:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    }

},{timestamps:true})
module.exports = mongoose.model("Comment", CommentSchema)