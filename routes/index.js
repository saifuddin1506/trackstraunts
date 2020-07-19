var express	= require("express");
var router = express.Router();
var passport= require("passport");
var User = require("../models/user");
var Campground = require("../models/campground");

router.get("/",function(req,res){
	res.render("landing");
});


//auth routes
//signup form
router.get("/register",function(req,res){
	res.render("register",{page:"register"});
});


//post signup
router.post("/register",function(req,res){
	var newUser= new User({username: req.body.username,avatar:req.body.avatar,firstName:req.body.firstName,lastName:req.body.lastName,email:req.body.email});
	
	if(req.body.adminCode==="1506")
		newUser.isAdmin=true;
	

	User.register(newUser,req.body.password,function(err,user){
		if(err){
			  // req.flash("error", err.message);
			return res.render("register",{error:err.message});
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Successfully signed up Nice to meet you "+user.username);
			res.redirect("/campgrounds");
		});
	});


});
//====login
router.get("/login",function(req,res){
	res.render("login",{page:'login'});
});

router.post("/login",passport.authenticate("local",
	{successRedirect:"/campgrounds",
	 failureRedirect:"/login"
	}),function(req,res){
});

//===logout route
router.get("/logout",function(req,res){
	req.logout();
	req.flash("error","logged you out");
	res.redirect("/campgrounds");
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}


//===users profile

router.get("/users/:id",function(req,res){
	User.findById(req.params.id,function(err,foundUser){
		if(err){
			req.flash("error","something went wrong");
			res.redirect("/campgrounds");
		}
		else{
			Campground.find().where("author.id").equals(foundUser._id).exec(function (err,campgrounds){
					if(err){
				req.flash("error","something went wrong");
				res.redirect("/campgrounds");
					}
					else
						res.render("users/show",{user:foundUser,campgrounds:campgrounds});
			});	
		}
	});
});

module.exports	= router;