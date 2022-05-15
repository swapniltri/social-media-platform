const express = require("express");
const router = express.Router();

const userController = require("./controllers/userController");
const postController = require("./controllers/postController");
const followController = require("./controllers/followController");

const isAuth = function(req,res,next){
    if(req.session.isAuth){
        next();
    }else{
        res.redirect("/");
    }
}

const isLoggedIn = function(req,res,next){
    if(req.session.isAuth){
        res.redirect("/home-dashboard");
    }else{
        next();
    }
}

router.get("/" , isLoggedIn , userController.home);
router.get("/home-dashboard" , isAuth , userController.home_dashboard);
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/logout", isAuth , userController.signout);
router.get("/profile/:username", isAuth , userController.myProfile);

router.get("/create-post", isAuth , postController.create_post);
router.post("/create-post", isAuth , postController.create_post_manage);
router.get("/post/:id", isAuth , postController.single_post_screen);
router.get("/post/:id/edit", isAuth , postController.edit_post);
router.post("/post/:id/delete", isAuth , postController.delete_post);
router.post("/post/:id/edit", isAuth , postController.edit_post_post);

router.get("/profile/:username/followers", isAuth , followController.get_followers);
router.get("/profile/:username/following", isAuth , followController.get_following);
router.post("/search", isAuth , followController.search);
router.post("/removeFollow/:username", isAuth , followController.remove_follow);
router.post("/addFollow/:username", isAuth , followController.add_follow);

module.exports = router;