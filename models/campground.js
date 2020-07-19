var mongoose=require("mongoose");

var campSchema= new mongoose.Schema({
	name:String,
	image:String,
	price:String,
	description:String,
	createdAt:{type:Date, default:Date.now},
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:String
	},
	comments:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref:"Comment"	
		}
	]
});



var Campground = mongoose.model("Campground",campSchema);

module.exports =Campground;