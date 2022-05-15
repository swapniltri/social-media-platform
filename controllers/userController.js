const user = require("../models/user");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Post = require("../models/post");

exports.home = function (req, res) {
    res.render("home-guest", { condition: false, message: "Invalid Username/Password" });
}

exports.signup = async function (req, res) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    await User.findOne({ username: username }, async function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                res.render("home-guest", { condition: true, message: "Username already in use" });
            } else {
                await User.findOne({ email: email }, function (err, foundMail) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (foundMail) {
                            res.render("home-guest", { condition: true, message: "Email already in use" });
                        } else {
                            if (!validator.isEmail(email)) {
                                res.render("home-guest", { condition: true, message: "Please use authentic email" });
                            } else {
                                var hash = bcrypt.hashSync(password, 8);
                                const signUpUser = new User({
                                    username: username,
                                    email: email,
                                    password: hash
                                });

                                try {
                                    signUpUser.save();
                                    req.session.isAuth = true;
                                    req.session.username = username;
                                    res.redirect("home-dashboard");
                                } catch (err) {
                                    console.log(err);
                                }
                            }
                        }
                    }
                }).clone().catch(function (err) { console.log(err) });
            }
        }
    }).clone().catch(function (err) { console.log(err) });
}

exports.login = function (req, res) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ username: username }, function (err, foundUser) {
        if (err) {
            console.log("Error occured in finding user");
        } else {
            if (foundUser) {
                if (bcrypt.compareSync(password, foundUser.password)) {
                    req.session.isAuth = true;
                    req.session.username = username;
                    res.redirect("/home-dashboard");
                } else {
                    res.render("home-guest", { condition: true, message: "Invalid Username/Password" });
                }
            } else {
                console.log("User not found");
                res.render("home-guest", { condition: true, message: "Invalid Username/Password" });
            }
        }
    });
}

exports.home_dashboard = async function (req, res) {
    const username = req.session.username;
    const postItem = [];
    const followingUserNames = [];
    let userExists;
    try {
        userExists = await User.findOne({ username: username });
    } catch (err) {
        res.send({ message: "Something went wrong!" });
    }
    if (!userExists) {
        res.send({ message: "User with given username doesn't exists" });
    }
    const { following } = userExists;
    following.map(each => followingUserNames.push(each.name));
    const fetchedPostsCursor = await Post.find({ user: { "$in": followingUserNames } });
    fetchedPostsCursor.map(each => {
        postItem.push(each);
    });
    postItem.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.render("home-dashboard", { User: username, username: username, postItem: postItem });
}

exports.signout = function (req, res) {
    req.session.destroy(err => {
        console.log(err);
    });
    res.redirect("/");
}

exports.myProfile = function (req, res) {
    User.findOne({ username: req.params.username }, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            if (req.session.username === result.username) {
                res.render("profile", {
                    User: req.session.username, noOfPosts: result.post.length, noOfFollowers: result.followers.length,
                    noOfFollowing: result.following.length, posts: result.post, username: req.session.username, condition: false, condition1: false,
                    condition2: false, UF: ""
                });
            } else {
                User.findOne({ username: req.session.username, "following.name": req.params.username }, function (err, result1) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (result1) {
                            res.render("profile", {
                                User: req.session.username, noOfPosts: result.post.length, noOfFollowers: result.followers.length,
                                noOfFollowing: result.following.length, posts: result.post, username: req.params.username, condition: false, condition1: true,
                                condition2: true, UF: ""
                            });
                        } else {
                            res.render("profile", {
                                User: req.session.username, noOfPosts: result.post.length, noOfFollowers: result.followers.length,
                                noOfFollowing: result.following.length, posts: result.post, username: req.params.username, condition: false, condition1: true,
                                condition2: false, UF: ""
                            });
                        }
                    }
                });
            }
        }
    });
}