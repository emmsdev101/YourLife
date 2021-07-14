const mongoose = require('mongoose')
const StorySchema = new mongoose.Schema({
	owner: {
		type: String,
		required: true
	},
	owner_fullname:{
		type:String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	likes:{
		type:Number,
		default:0
	},
	comments :{
		type:Number,
		default:0
	},
    images: {
        type: String,
        required: false
    },
	date :{
		type:Date,
		default:Date.now
	},


});

module.exports = mongoose.model('Story', StorySchema);
