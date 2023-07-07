const dotenv = require('dotenv'); 
const express = require('express');
const path = require ('path');

const connectDB = require('./config/db');

const errorHandler = require('./middleware/error');


//connect to DB
connectDB();

const app = express();

app.use(express.json());

app.use('/api/auth',require('./routes/index'));
app.use('/api/private',require('./routes/private'));

//Error Handler (Should be last piece of middleware)
app.use(errorHandler);

dotenv.config({path:'./config.env'})
const PORT = process.env.PORT || 8080

const server = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});

// To handle unhandled rejections (to show only error message, but not lengthy crashed error lines)
process.on("unhandledRejection", (err, promise) => {
    console.log(`unhandled rejection: ${err}`);
    server.close(() => process.exit(1));

})