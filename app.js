var express = require("express");
var app= express();
var bodyparser= require("body-parser");
var passport= require("passport");
var localStrategy = require("passport-local");
var User = require("./models/user");
var mongoose=require("mongoose");
var Campground = require("./models/campground");
var Comment= require("./models/comment");
var seedDB = require("./seed");
var methodOverride = require("method-override");
var flash = require("connect-flash");
var commentRoutes= require("./routes/comments"),
	campgroundRoutes= require("./routes/campgrounds"),
	indexRoutes= require("./routes/index");

//seedDB();



mongoose.connect("mongodb://localhost/restraunt",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false});

app.use(bodyparser.urlencoded({extended:true}));

app.set("view engine","ejs");


app.use(express.static(__dirname +"/public"));
app.use(methodOverride("_method"));
app.use(flash());

//=====
//adding authentications
app.use( require("express-session")({
	secret:" rusty is beautiful dog",
	resave:false,
	 saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use( new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	res.locals.currentUser= req.user;
	res.locals.error = req.flash("error");
	res.locals.success=req.flash("success");
	next();
});
app.use(commentRoutes);
app.use(campgroundRoutes);
app.use(indexRoutes);
app.locals.moment= require("moment");


app.listen(process.env.PORT ||3000,process.env.IP,function(){
	console.log("yelpcamp server has started");
});
