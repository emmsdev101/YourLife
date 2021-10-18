const mongoose = require('mongoose')
const StorySchema = new mongoose.Schema({
	owner: {
		type: String,
		required: true
	},
	owner_id:{
		type:String,
		required:true
	},
	content: {
		type: String,
		required: false
	},
	photo_only:{
		type:Boolean,
		default:false
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
