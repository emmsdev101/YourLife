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


//----------------------------------------- END OF IMPORTS---------------------------------------------------



// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);


app.use(
  cors({
    origin: "http://localhost:3000", // <-- location of the react app were connecting to
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

//----------------------------------------- END OF ROUTES---------------------------------------------------
try{
  mongoose.connect("mongodb+srv://emmsamazing:iamamazing1998@cluster0.v2r5z.mongodb.net/YOURLIFE?retryWrites=true&w=majority", {
useNewUrlParser: true,
useUnifiedTopology: true
  });
  console.log('Database Connected')
}catch(err){
  console.log(err)
}
//Start Server
app.listen(4000, () => {
  console.log("Server Has Started");
});
