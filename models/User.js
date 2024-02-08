// Import Dependencies
const mongoose = require("mongoose");


// Creating Schema for Signin
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required : true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model("User",userSchema);
User.createIndexes(); // for unique value
module.exports = User;