const mongoose = require('mongoose');
const validator = require("validator");

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        index: true,
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


userSchema.index({ firstName: 1, lastName: 1, about: 1, skills: 1 });

userSchema.methods.getJWT = async function() {
    const jwt = require('jsonwebtoken');
    const token = await jwt.sign({ _id: this._id }, "DEV@123", { expiresIn: '1d' });
    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const bcrypt = require('bcrypt');
    const passwordHash = this.password;
    const isPasswordMatch  = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordMatch;
}

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;