const nodemailer = require('nodemailer');
const dotenv = require('dotenv'); 
dotenv.config({path:'./config.env'})

const sendEmail = (options) => {

    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });


    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.text,
    };


    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.error(err);
        }else {
            console.log(info);
        }
    });

};

module.exports = sendEmail;