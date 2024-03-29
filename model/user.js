const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	firstname :{
		type:String,
		required:true
	},
	lastname :{
		type:String,
		required:true
	},
	gender :{
		type:String,
		required:true
	},
	age :{
		type:Number,
		required:true
	},
	photo:{
		type:String,
		required:false
	},
	followers:{
		type:Number,
		default: 0
	},
	following:{
		type: Number,
		default: 0
	},
	date :{
		type:Date,
		default:Date.now
	},


});

module.exports = mongoose.model('User', UserSchema);
