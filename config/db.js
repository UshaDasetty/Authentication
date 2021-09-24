const mongoose = require('mongoose')

const connectDB = async() => {
        const con = await mongoose.connect(`mongodb+srv://zomato:MongoConnection@cluster0.votdq.mongodb.net/Authentication?retryWrites=true&w=majority`,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            //  useFindAndModify:true,
            //  useCreateIndex:true
    })
    console.log(`MongoDB connected:${con.connection.host}`);
}


module.exports = connectDB;