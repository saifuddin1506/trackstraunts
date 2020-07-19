var Campground =require("../models/campground");
var Comment =require("../models/comment");
var flash = require("connect-flash");
var  middlewareobj={};
	
	
		
	
		middlewareobj.isLoggedIn=					function (req,res,next){
														if(req.isAuthenticated()){
															return next();
														}
														req.flash("error", "please login first");
														res.redirect("/login");
																		}
middlewareobj.checkOwnership = function (req,res,next){
								if(req.isAuthenticated()){
										Campground.findById(req.params.id,function(err,found){
											if(err){
												req.flash("error","restraunt not found");
												res.redirect("back");
											}
											else
											{
												if(found.author.id.equals(req.user.id)|| req.user.isAdmin){
													return next();
												}
												else{
													req.flash("error","permission denied");
													res.redirect("back");
												}
											}
										});

									}
							else{
								req.flash("error","you must login first");
								res.redirect("back");
							}
							}
middlewareobj.checkCommentOwnership=	function (req,res,next){
										if(req.isAuthenticated()){
												Comment.findById(req.params.comment_id,function(err,found){
													if(err)
														res.redirect("back");
													else
													{
														if(found.author.id.equals(req.user.id)|| req.user.isAdmin){
															return next();
														}
														else
															res.redirect("back");
													}
												});

											}
									else
										res.redirect("back");
									}

							
module.exports = middlewareobj;