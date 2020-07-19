var express	= require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index");

router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err)
			console.log(err);
		else
			res.render("comments/new",{campground: campground});
	});
});


router.post("/campgrounds/:id/comments",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err)
		{
			console.log(err);
			res.redirect("/campgrounds");
		}
		else{
		Comment.create(req.body.comment,function(err,com){
			if(err)
				console.log(err)
			else{
				com.author.id= req.user._id;
				com.author.username= req.user.username;
				com.save();
				campground.comments.push(com);
				campground.save();
				res.redirect("/campgrounds/"+ campground._id);
			}
		})
	}
	});
});

//====edit comment
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
	
			Comment.findById(req.params.comment_id,function(err,com){
				if(err)
					res.redirect("/campgrounds");
				else{

					res.render("comments/edit",{campground_id:req.params.id,comment:com});
				}
			});
			
		});

router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,com){
		if(err)
			res.redirect("back");
		else{
			req.flash("success","successfully edited comment");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});
	
//==delete comment
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err,com){
		if(err)
			console.log(err);
		else{
			req.flash("success","successfully deleted comment");
		res.redirect("/campgrounds/"+req.params.id);
	}
	});
});



module.exports	= router;