const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv'); 
dotenv.config({path:'./config.env'})

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"]
    },

    email: {
        type: String,
        required: [true, "Please provide a email"],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, // regular expression for email in Javascript
            "Please provide a valid email"
        ]
    },

    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 6,
        select: false
    },

    resetpasswordToken: String,
    resetpasswordExpire: Date

});


// It will run before saving password to database
UserSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


// It will check whether the password entered by the user match password in the DB
UserSchema .methods.matchPasswords = async function (password) {
    return await bcrypt.compare(password, this.password);
};


// To generate Json Web Token(JWT) to authorize the user
// To get "JWT_SECRET" -> require('crypto').randomBytes(35).toString("hex")  -> type this in the command line
UserSchema.methods.getSignedToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};


UserSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    return resetToken;
}

module.exports = mongoose.model('User',UserSchema, 'User');