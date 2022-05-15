const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true
        },
        email:{
            type: String,
            required: true,
            unique: true
        },
        password:{
            type: String,
            required: true
        },
        followers:[
            {
                name:{
                    type: String,
                    required: true
                }
            }
        ],
        following:[
            {
                name:{
                    type: String,
                    required: true
                }
            }
        ],
        post:[
            {
                post_id:{
                    type: String,
                    required: true
                },
                post_title:{
                    type: String,
                    required: true
                },
                post_date:{
                    type: String,
                    required: true
                }
            }
        ]
    }
);

const User = mongoose.model('user',UserSchema);

module.exports = User;