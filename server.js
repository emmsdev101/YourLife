const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const path = require('path')
const accRoute = require('./routes/Account')
const postRoute = require('./routes/Story')
const uploadRoute = require('./routes/Upload')
require('dotenv').config()


//----------------------------------------- END OF IMPORTS---------------------------------------------------
// Middleware
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);


app.use(
  cors({
    origin: 'http://localhost:3000', // <-- location of the react app were connecting to
    credentials: true,
  })
);

app.use(cookieParser("secretcode"));
app.use('/user', accRoute);
app.use('/post', postRoute)
app.use('/upload', uploadRoute)
app.use('/photos', express.static(path.join('uploads/user')))
//----------------------------------------- END OF MIDDLEWARE---------------------------------------------------


// Routes
//if (process.env.NODE_ENV === "development") {
    //Set static folder
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
 // }

//----------------------------------------- END OF ROUTES---------------------------------------------------
try{
  mongoose.connect(process.env.DB_CONNECTION, {
useNewUrlParser: true,
useUnifiedTopology: true
  });
  console.log('Database Connected')
}catch(err){
  console.log(err)
}
//Start Server
app.listen(process.env.PORT || 4000, () => {
  console.log("Server Has Started");
});
