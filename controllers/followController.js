const express = require("express");
const User = require("../models/user");
const Post = require("../models/post");

exports.get_followers = function(req,res){
    User.findOne({username: req.params.username},function(err,result){
        if(err){
            console.log(err);
        }else{
            res.render("profile-followers",{User: req.session.username , username: req.params.username , followers: result.followers , 
                noOfPosts: result.post.length , noOfFollowers: result.followers.length , noOfFollowing: result.following.length});
        }
    });
}

exports.get_following = function(req,res){
    User.findOne({username: req.params.username},function(err,result){
        if(err){
            console.log(err);
        }else{
            res.render("profile-following",{User: req.session.username , username: req.params.username , following: result.following , 
                noOfPosts: result.post.length , noOfFollowers: result.followers.length , noOfFollowing: result.following.length});
        }
    });
}

exports.search = function(req,res){
    const username = req.body.username;
    User.findOne({username:username},function(err,result){
        if(err){
            console.log(err);
        }else{
            if(result){
                res.redirect(`/profile/${username}`);
            }else{
                res.redirect("back");
            }
        }
    });
}

exports.add_follow = function(req,res){
    User.updateOne({username: req.session.username}, {$push : {following : {name : req.params.username}}}, function(err,result){
        if(err){
            console.log(err);
        }else{
            User.updateOne({username: req.params.username}, {$push : {followers : {name : req.session.username}}}, function(err,result2){
                if(err){
                    console.log(err);
                }else{
                    User.findOne({username: req.params.username}, function(err,result1){
                        res.render("profile",{User: req.session.username, noOfPosts: result1.post.length, noOfFollowers: result1.followers.length, 
                            noOfFollowing: result1.following.length, posts: result1.post, username:result1.username, condition: true, condition1: true,
                            condition2: true, UF:"followed"});
                    });
                }
            });
        }
    });
}

exports.remove_follow = function(req,res){
    User.updateOne({username: req.session.username}, {$pull : {following : {name : req.params.username}}}, function(err,result){
        if(err){
            console.log(err);
        }else{
            User.updateOne({username: req.params.username}, {$pull : {followers : {name : req.session.username}}}, function(err,result2){
                if(err){
                    console.log(err);
                }else{
                    User.findOne({username: req.params.username}, function(err,result1){
                        res.render("profile",{User: req.session.username, noOfPosts: result1.post.length, noOfFollowers: result1.followers.length, 
                            noOfFollowing: result1.following.length, posts: result1.post, username:result1.username, condition: true, condition1: true,
                            condition2: false, UF:"unfollowed"});
                    });
                }
            });
        }
    });
}