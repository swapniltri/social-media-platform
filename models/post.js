const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema(
    {
        title:{
            type: String,
            required: true,
            maxLength: 50
        },
        description:{
            type: String,
            required: true
        },
        date:{
            type: String,
            required:true
        },
        user:{
            type: String,
            required: true
        },
        changed:{
            type: Number,
            required: true
        }
    }
);

const Post = mongoose.model('post',PostSchema);

module.exports = Post;