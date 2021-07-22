const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router()
const User = require("./../model/user");
const Following = require("./../model/following")

const saveImage = require('./../helper/Upload')


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
    const user_id = req.session.user
    try{
        User.findOne({
            _id: user_id
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
        const user = await User.findOne({_id:req.session.user})
        if(user){
            const followers = await Following.find({following:user.username},null,{limit:6})
            if(Array.isArray(followers)){
                let follwersObject = []
                for (let index = 0; index < followers.length; index++) {
                    const follower = followers[index];
                    const get_profile = await User.findOne({username:follower.follower})
                    if(get_profile){
                        follwersObject.push({
                            username:get_profile.username,
                            firstname:get_profile.firstname,
                            lastname:get_profile.lastname,
                            photo:get_profile.photo
                        })
                    }
                }
                res.send(follwersObject)
            }else res.sendStatus(304)     
        }else{
            res.sendStatus(304)
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
  router.post('/change-profile', auth, async (req, res, next)=> {
    try{
        const file = req.body.file
        const path = await saveImage(req, res, file)

        if(path){
            const updatedProfile = await User.updateOne({_id: req.session.user},{photo:path})
            if(updatedProfile){
                res.send(path)
            }
        }
    }catch(err){
        console.log(err)
        res.sendStatus(444)
    }
})
  router.put("/update-dp", auth, async(req, res) =>{
      
  })
  router.get("/logout", async(req, res) => {
      console.log("user " + req.session.user + " is logged out.")
      req.session.destroy((err)=>{
        if(err) {
            consoole.log(err)
            res.send(500)
        }else res.sendStatus(200)
      })
      

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
        follow.save(function(err, followed){
            if(err){
                console.log(err)
                return res.sendStatus(444)
            }else{
                const followerReq = User.findOneAndUpdate({username:follower},
                    {
                        $inc: {
                          following: +1,
                        },
                    },
                    {useFindAndModify:false}
                )
                const followedReq = User.findOneAndUpdate({username:req.body.username},
                    {
                        $inc: {
                          followers: +1,
                        },
                    },
                    {useFindAndModify:false}
                )
                Promise.all([followerReq, followedReq]).then(
                    (result)=>{
                        res.send(true)
                    }
                )
            }
            
        })
    }
    const unfollow = async(follower) => {
        Following.deleteOne({follower:follower, following:req.body.username},(err)=>{
            if(err){
                console.log(err)
                return res.sendStatus(444)
            }else{
                const followerReq =  User.findOneAndUpdate(
                    {
                        username:follower,
                        following: { $gt: 0 }
                    },
                    {
                        $inc: {
                          following: -1,
                        },
                    },
                    {useFindAndModify:false}
                )
                const followedReq =  User.findOneAndUpdate(
                    {
                        username:req.body.username,
                        followers: { $gt: 0 }
                    },
                    {
                        $inc: {
                          followers: -1,
                        },
                    },
                    {useFindAndModify:false}
                )
                Promise.all([followerReq, followedReq]).then(
                    (result)=>{
                        res.send(true)
                    }
                )
            }
        })
    }
    try{
        User.findOne({_id:req.session.user}, (err, user_follower)=> {
            if(err)return res.sendStatus(444)
            if(!user_follower) return res.sendStatus(403)
            Following.findOne({follower:user_follower.username,following:req.body.username}, (err, following)=>{
                if(err)return res.sendStatus(444)
                if(!following){
                    follow(user_follower.username)
                }else{
                    unfollow(user_follower.username)
                }

            })
        })
        
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