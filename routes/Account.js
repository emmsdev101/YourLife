const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router()
const User = require("./../model/user");
const Following = require("./../model/following")


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
// --------------- GET ROUTES ---------------
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
            _id : 0,
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
router.get('/follows', async(req, res)=>{
    try{
        Following.find((err, doc)=>{
            if(err){
                console.log(err)
            }
            res.send(doc)
        })
    
    }catch(err){
        console.log(err)
        res.sendStatus(444)
    }
    
})
router.get('/isfollowing', auth, async(req, res)=> {
    try{
        const get_user = await User.findOne({_id:req.session.user})
        if(get_user){
            const isfollowing = await Following.findOne({follower:get_user.username, following:req.query.username})
            if(isfollowing){
                res.send(true)
            }else{
                res.send(false)
            }
        }else{
            res.sendStatus(404)
        }
    }catch(err){
        console.log(err)
        res.sendStatus(444)
    }
    
})
router.get('/followers', auth, async(req, res)=>{
    try{
        const follower = await User.findOne({_id:req.session.user})
        if(follower){
            const followers = await Following.find({follower:follower.username},null,{limit:6})
            res.send(followers)
        }else{
            res.sendStatus(404)
        }
    }catch(err){
        console.log(err)
        res.send(444)
    }
})
router.get('/status', async(req, res, next)=> {
    try{
        const user = await User.findOne({_id:req.session.user})
        if(user){
            const followers = await Following.countDocuments({following:user.username})
            const following = await Following.countDocuments({follower:user.username})
            console.log(followers)
            console.log(following)
            res.send({followers, following})
        }else{
            res.sendStatus(404)
        }
    }catch(err){
        console.log(err)
        res.sendStatus(444)
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
  // ----------- UPDATE ACCOUNT ROUTE --------------//
  router.put("/update-dp", auth, async(req, res) =>{
      User.updateOne({username: req.body.username},{
          photo:req.body.path
      }, function(err, doc){
          if(err){
              console.log(err)
              res.sendStatus(444)
          }
          if(!doc){
              res.send({
                  error:"No user account found"
              })
          }
          res.sendStatus(200)
      })
  })
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
// FOLLOWING
router.post('/follow', auth, async(req, res)=>{
    const follow = async(follower) => {
        const follow = new Following({
            follower:follower,
            following:req.body.username
        })
        follow.save(function(err, doc){
            if(err){
                console.log(err)
            }else{
                res.send(true)
            }
        })
    }
    const unfollow = async(follower) => {
        Following.deleteOne({follower:follower, following:req.body.username},(err)=>{
            if(err){
                console.log(err)
                res.send(444)
            }else{
                res.send(true)
            }
        })
    }
    try{
        const user_follower = await User.findOne({_id:req.session.user})
        if(user_follower){
            const following = await Following.findOne({follower:user_follower.username,following:req.body.username})
            if(following){
                unfollow(user_follower.username)
            }else{
                follow(user_follower.username)
            }
            
        }else{
            res.sendStatus(404)
        }
    }catch(err){
        console.log(err)
    }
})
router
// DELETING SINGLE USER

router.delete('/accout', auth, async(req, res) => {
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