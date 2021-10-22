const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();

const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
const accRoute = require("./routes/Account");
const postRoute = require("./routes/Story");
const photoRoute = require('./routes/Photo')
const notificationRoute = require('./routes/Notification')

let onlineUsers = new Object()
app.set('socketio', io)
app.set('onlineUsers',onlineUsers)

require("dotenv").config();

//----------------------------------------- END OF IMPORTS---------------------------------------------------
// Middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(
  cors({
    origin: "http://localhost:3000", 
    credentials: true,
  })
);

app.use(cookieParser("secretcode"));
app.use("/user", accRoute);
app.use("/post", postRoute);
app.use('/photo', photoRoute)
app.use('/notification', notificationRoute)
//----------------------------------------- END OF MIDDLEWARE---------------------------------------------------

// Routes
//if (process.env.NODE_ENV === "development") {
//Set static folder
app.use(express.static("client/build"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

io.on('connection', (socket) => {
  socket.on('connect-me',(userId)=>{
    onlineUsers[userId] = socket.id
  })
  socket.on('join', (room)=>{
    socket.join(room)
  })
});


server.listen(process.env.PORT || 4000,()=>{
  
})
// }

//----------------------------------------- END OF ROUTES---------------------------------------------------
try {
  mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Database Connected");
} catch (err) {
  console.log(err);
}

