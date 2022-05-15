const { ModuleFilenameHelpers } = require("webpack");
const Post = require("../models/post");
const User = require("../models/user");

exports.create_post = function(req,res){
    res.render("create-post",{User: req.session.username});
}

exports.create_post_manage = function(req,res){
    // User.updateOne({username:req.session.username}, { $set: { post: [] }}, function(err, affected){
    //     console.log('affected: ', affected);
    // });
    // return;
    const today = new Date();
    const date = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    const title = req.body.title;
    const description = req.body.body;
    const myDate = date+" "+time;
    const username = req.session.username;
    const changed = 0;

    const newPost = new Post({
        title: title,
        description: description,
        date: myDate,
        user: username,
        changed: changed
    });

    newPost.save().then(result => {
        User.findOneAndUpdate( { username : result.user },{ $push : { post : {post_id: result._id , post_title: result.title , post_date : myDate }}}).then(result1 =>{
            res.redirect(`/post/${result._id}`);
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
}

exports.edit_post = function(req,res){
    Post.findOne({_id: req.params.id},function(err,result){
        if(err){
            console.log(err);
        }else{
            res.render("edit-post",{User: req.session.username, postID: req.params.id, title: result.title, content: result.description});
        }
    });
}

exports.edit_post_post = function(req,res){
    Post.findOneAndUpdate({_id:req.params.id}, {$set : {title : req.body.title , description : req.body.body}} ,function(err,result){
        if(err){
            console.log(err);
        }else{
            const today = new Date();
            const date = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate();
            const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            const myDate = date+" "+time;
            User.findOneAndUpdate({username:req.session.username,"post.post_id":req.params.id},
            {$set : {"post.$.post_title" : req.body.title , "post.$.post_date" : myDate }},function(err,result1){
                if(err){
                    console.log(err);
                }else{
                    res.redirect(`/post/${req.params.id}`);
                }
            })
        }
    });
}

exports.delete_post = function(req,res){
    Post.deleteOne({_id: req.params.id},function(err,result){
        if(err){
            console.log(err);
        }else{
            User.updateOne({username: req.session.username},{ $pull: { post: { post_id: req.params.id }}},function(err,result1){
                if(err){
                    console.log(err);
                }else{
                    res.redirect(`/profile/${req.session.username}`);
                }
            });
        }
    });
}

exports.single_post_screen = function(req,res){
    Post.findOne({_id:req.params.id},function(err,result){
        if(err){
            console.log(err);
            res.redirect("/create-post");
        }else{
            if(result.changed === 0){
                Post.updateOne({_id:req.params.id},{$set : { changed : 1}},function(err,result1){
                    if(err){
                        console.log(err);
                    }else{
                        res.render("single-post-screen",{postID:result._id, User:result.user, condition: true, title: result.title, username: result.user, date: result.date, content: result.description});
                    }
                });
            }else{
                res.render("single-post-screen",{postID:result._id, User:result.user, condition: false, title: result.title, username: result.user, date: result.date, content: result.description});
            }
        }
    });
}