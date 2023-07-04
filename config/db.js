const mongoose = require('mongoose')
const dotenv = require('dotenv'); 
dotenv.config({path:'./config.env'})

const connectDB = async() => {
        const con = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            //  useFindAndModify:true,
            //  useCreateIndex:true
    })
    console.log(`MongoDB connected:${con.connection.host}`);
}


module.exports = connectDB;