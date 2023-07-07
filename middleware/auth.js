const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');


exports.protect = async (req, res, next) => {
    let token;   

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
     // This token will split like this from the array and select the second part -> Bearer 42trgf654688hgfgdhj67hhf
        token = req.headers.authorization.split(' ')[1];  
    }

    if(!token) {
        return next(new ErrorResponse("Not authorized to access this page",401));
    }

    try {
        // If token found it will just decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        // It will find the user with decoded id
        const user =await User.findById(decoded.id);


        // If user is not found with that decoded id it will not allow user to access the website
        if(!user) {
            return next(new ErrorResponse("No user found with this id",404));
        }

        
        // if user found with that decoded id, it will allow to access the website
        req.user = user;

        next();

    } catch (error) {
        return next(new ErrorResponse("Not authorized to access this page",401));
    }
}