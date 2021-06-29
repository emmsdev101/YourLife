const mongoose = require('mongoose')
const PhotoSchema = new mongoose.Schema({
	owner: {
		type: String,
		required: true
	},
	post_id: {
		type: String,
		required: true
	},
    path:{
        type:String,
        required:true
    },
	date :{
		type:Date,
		default:Date.now
	},
});

module.exports = mongoose.model('Photo', PhotoSchema);
