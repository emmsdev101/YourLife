const mongoose = require('mongoose')
const SocketSchema = new mongoose.Schema({
    user_id:{
        type:String,
        require:true
    },
    socket_id:{
        type:String,
        required:true
    }
},{timestamps:true})
module.exports = mongoose.model("sockets", SocketSchema)