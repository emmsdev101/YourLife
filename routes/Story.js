const Story = require('./../model/story')
const Photo = require('./../model/photo')
const User = require('./../model/user')
const bcrypt = require("bcrypt");
const router = require('express').Router()
const fs = require('fs');
const following = require('../model/following');

const auth = (req, res, next) => {
    if(req.session.user){
        next()
    }else{
        res.sendStatus(401)
    }
}
const admin = (req, res, next) => {
    if(req.query.key === 'iamamazing1998'){
        next()
    } else res.sendStatus(401)
}
router.post('/create', auth, async(req, res, next)=>{
    try{
        const data = new Story({
            owner:req.body.owner,
            content:req.body.content,
            images:req.body.images,
            likes:0,
            comments:0
            })
            const img_paths = req.body.imagePath
            data.save(function(err, post){
                if(err)return console.log(err)
                img_paths.forEach(path => {
                    const photo = new Photo({
                        owner:post.owner,
                        post_id: post._id,
                        path:path
                    })
                    photo.save(function(err, saved_photo){
                        if(err)return console.log(err)
                    })
                });
                res.send(post)
            })
    }catch(err){
        console.log(err)
        res.sendStatus(444)
    }
})
router.get('/my-posts', auth, async(req, res, next) => {
    try{
        const user = await User.findOne({_id:req.session.user})
        if(user){
            const stories = await Story.find({owner:user.username},null, {limit:10})
            res.send(stories)
        }
    }catch(err){
        console.log(err)
        res.sendStatus(444)
    }
})
router.get('/all-feeds', auth, async(req, res, next)=>{
    try{
        const feeds = await Story.find().sort({date:-1})
        res.send(feeds)
    }catch(error){
        console.log(error)
    }
})
router.delete('/story', auth, async(req, res) => {
    Story.findOneAndDelete({_id: req.body.post_id}, function(err, doc){
        if(err){console.log(err);res.sendStatus(444)}
        if(!doc) res.sendStatus(444)
    })
})
// DELETING ALL STORIES 
router.delete('/all',admin, (req, res, next) =>{
    Story.deleteMany({}, (story_err, story_res) => {
       if(story_err){
           console.log(story_err); 
           return res.sendStatus(444)
        }
        console.log('Story deleted from database')
        Photo.deleteMany({}, function(photo_err, photo_del){
            if(photo_err){
                console.log(photo_err);
                return res.sendStatus(444)
            }
            console.log('Photo deleted from database')
            res.send({msg:'Story deleted'})
            const dir = './uploads/user/'
            // fs.unlinkSync(dir, (del_err)=>{
            //     if(del_err){
            //         console.log(del_err)
            //         return res.sendStatus(444)
            //     }
            //     console.log('Photo deleted at :'+dir)
            //     res.send({msg:'Story deleted'})
            // })
        })
    })
    
})
module.exports = router