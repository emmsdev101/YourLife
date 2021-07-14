const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router()
const User = require("./../model/user");
const user = require("./../model/user");


// --- Authentication handler ------------- //

const auth = (req, res, next) => {
    if(req.session.user){
        next()
    }else{
        res.sendStatus(401)
    }
}
const admin = (req, res, next)=> {
    if(req.query.key === 'iamamazing1998'){
        next()
    }else res.sendStatus(401)
}

router.get('/fetchAll', auth, async(req, res)=>{
    try{
        const users = await User.find({},{
            'password' : 0
        })
        res.send(users)
    }catch(error){
        res.send(error)
        console.log(error)
    }
})
router.get('/account', auth, async(req, res, next)=>{
    const id_param = req.query.id
    try{
        User.findOne({
            username: id_param
        },{
            password:0
        }, function(err, doc){
            if(err) return console.log(err)
            if(!doc) return  res.sendStatus(444)
            return res.send(doc)
        })
    }catch(err){
        console.log(err)
        res.send(444)
    }

})
// ---------------- LOGIN ROUTE ------------------//
router.post("/login", async(req, res) => {
    try{
        const account = await User.findOne({username:req.body.username})
        if(!account){
            res.send({wrong_user:true})
        }else{
            bcrypt.compare(req.body.password,account.password,  (err, result) => {
                if (err) throw err;
                if (result === true) {
                    req.session.user = account._id
                    req.session.save
                    res.send({
                      username: account.username,
                      firstname:account.firstname,
                      lastname:account.lastname,
                      age:account.age,
                      gender:account.gender,
                      followers:account.followers,
                      following: account.following,
                      photo: account.photo
                  })
                } else {
                  res.send({
                      wrong_password:true
                  })
                  console.log('wrong password')
                }
              });
        }
    }catch(error){
        res.sendStatus(404)
        console.log(error)
    }
    
  });
  router.get("/logout", async(req, res) => {
      req.session.destroy
      res.sendStatus(200)

  })
  //  ------------------- REGISTRATION ROUTE --------------------------- //
router.post("/register", (req, res) => {
    User.findOne({ username: req.body.username }, async (err, doc) => {
      if (err) throw err;
      if (doc) res.send({
          exists: true
      });
      if (!doc) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
          username: req.body.username,
          password: hashedPassword,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          gender: req.body.gender,
          age: req.body.age
        });
        try{
            await newUser.save();
            res.send({
                registered: true,
                id:newUser._id,
                username: newUser.username,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                age:newUser.age,
                gender:newUser.gender
            });
        }catch(error){
            console.log(error)
            res.send({
                registered: false
            })
        }
      }
    });
})
// UPDATING USER PROFILE
router.put('/account', auth, async(req, res)=>{
    console.log(req.body.username)
    console.log(req.body.path)
     User.updateOne({username:req.body.username},
        {photo:req.body.path}, function(err, doc){
            if(err){console.log(err);res.send(444);}
            res.send(doc)
        })
})
// DELETING SINGLE USER

router.delete('/accout', auth, (req, res) => {
    User.findOneAndDelete({username: req.session.user}, function(err, doc){
        if(err)return console.log(err)
        if(!doc) return res.sendStatus(401)
        res.send({msg:'Succesfully deleted'})
    })
})
// DELETING ALL USERS 
router.delete('/all', admin, async(req, res) =>{
    User.deleteMany({}, function(err, doc){
        if(err) return console.log(err)
        res.send(doc)
    })
})

  module.exports = router