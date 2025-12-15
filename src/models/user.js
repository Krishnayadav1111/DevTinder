const mongoose = require('mongoose');
const validator = require("validator");

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLenght: 4,
        maxLenght: 100
    },
    lastName: {
        type: String,

    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address")
            }
        },

    },
    password: {
        type: String,
        required: true,

    },
    age: {
        type: Number,
        min: 18,
        max: 70
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender data is not valid");
            }
        },
        lowercase: true,
    },
    photoUrl: {
        type: String,
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid email address")
            }
        },
    },
    about: {
        type: String,
        default: "default value of user",
    },
    skills: {
        type: [String],
    },
    location: {
        type: String,
    },

}, { timestamps: true, });

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;