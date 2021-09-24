const crypto = require('crypto');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

exports.register = async (req, res, next) => {
    const {username, email, password} = req.body;

    try {
        const user = await User.create({
            username,
            email,
            password
        });

        sendToken(user, 201, res);
    } catch (error) {
        next(error);
    }
};



exports.login = async (req, res, next) => {
    const {email, password} = req.body;

    if( !email || !password ) {
        return next( new ErrorResponse("Please provide an valid email and password",400));
    }

    try {
        const user = await User.findOne({ email }).select("+password");
        if(!user) {
            return next( new ErrorResponse("Invalid Credentials",401));
        }


        const isMatch = await user.matchPasswords(password);
        if(!isMatch) {
            return next( new ErrorResponse("Invalid Credentials",401));
        }

        sendToken(user, 200, res);

    } catch (error) {
        res.status(500).json({ success: false, error: error.message})
    }
};



exports.forgotpassword = async (req, res, next) => {
    const {email} = req.body;

    try {
        const user = await User.findOne({ email });

        if(!user) {
            return next(new ErrorResponse("Email could not be send", 404));
        }

        const resetToken = user.getResetPasswordToken();

        await user.save();

        const resetUrl =`http:localhost:3000/passwordreset/${resetToken}`;

        const message =`<h1> You have requested a password reset</h1>
        <p>Please go to this link to reset your password</p>
        <a href="${resetUrl} clicktracking=off>${resetUrl}</a>`

        try {
            await sendEmail({
                to: user.email,
                subject: "password Reset Request",
                text: message
            });

            res.status(200).json({success: true, data:"Email send"});
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            return next(new ErrorResponse("Email could not be sent"));
        }

    } catch (error) {
        
    }
};



exports.resetpassword = async (req, res, next) => {
    const resetToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
    
    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        })

        if(!user) {
            return next(new ErrorResponse("Invalid Rese Token",400))
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            data: "Password reset Success"
        })
    } catch (error) {
        next(error);
    }
};

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken()
    res.status(statusCode).json({success: true,  token})
};