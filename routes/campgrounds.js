var express	= require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index");
router.get("/campgrounds",function(req,res){
	Campground.find({},function(err,campgrounds){
		if(err)
			console.log(err);
		else{
			res.render("campgrounds/index",{campgrounds:campgrounds,page:"campgrounds"})
		}
	})
	
});


router.get("/campgrounds/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});



router.post("/campgrounds",middleware.isLoggedIn,function(req,res){
	var title= req.body.name;
	var url=req.body.image;
	var price =req.body.price;
	var desc= req.body.description;
	var author= {
		id:req.user._id,
		username:req.user.username
	};
	var newCamp= {name:title,price:price,image:url,description:desc,author};
	Campground.create(newCamp,function(err,camp){
		if(err){
			console.log("some error");
		}
		else{
			req.flash("success","restraunt added!");
			res.redirect("/campgrounds");
		}
})
}
);


router.get("/campgrounds/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,camp){
			if(err)
					console.log("id m error")
			else{
				//console.log(camp)
				res.render("campgrounds/show",{campground:camp});
			}
	});
});
//===edit 

router.get("/campgrounds/:id/edit",middleware.checkOwnership,function(req,res){
	Campground.findById(req.params.id,function(err,foundCamp){
		if(err)
			res.redirect("/campgrounds");
		else
		{
			console.log("edit route");
			res.render("campgrounds/edit",{campground:foundCamp})
		}
	});
	
});
router.put("/campgrounds/:id",middleware.checkOwnership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCamp){
		if(err)
			res.redirect("/campgrounds");
		else{
			req.flash("success","restraunt edited");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});

});
//===delete
router.delete("/campgrounds/:id",middleware.checkOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err,camp){
		if(err)
			res.redirect("/campgrounds");
		else{
			req.flash("success","restraunt deleted");
			res.redirect("/campgrounds");
		}
	});
});


module.exports	= router;