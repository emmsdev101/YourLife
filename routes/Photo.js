const router = require("express").Router();

const Story = require("./../model/story");
const User = require("./../model/user");
const ImageModel = require('../model/photo');
const photo = require("../model/photo");

const {getFileStream} = require('../helper/s3')

const auth = (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.sendStatus(401);
    }
  };

router.get('/post-photos', auth, async(req, res)=>{
    try{
        const fetch_res = await ImageModel.find({
            post_id: req.query.id
        })
        res.send(fetch_res)
    }catch(err){
        res.sendStatus(500)
    }
})
router.get('/my-photos', async(req, res)=> {
    let username = req.query.username
    let user
    try{
        if(!username){
            user = await User.findOne({_id:req.session.user})
            username = user.username
        }else user = username
        if(user){
            const images = await ImageModel.find({owner:username}, null, {limit:6})
            res.send(images)
        }
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
})
router.get('/my-gallery', async(req, res)=> {
    try{
        let username = req.query.username
        if(!username){
            const user = await User.findOne({_id:req.session.user})
            if(user){
                username = user.username
            }
            else {
                return res.sendStatus(304)}
        }
            const images = await ImageModel.find({owner:username}, null, {limit:30})
            res.send(images)
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
})
router.get('/:key', (req, res)=>{
    try{
        const key = req.params.key
    const readStream = getFileStream(key)
    readStream.pipe(res)
    }catch(err){
        console.log(err)
        res.send(444)
    }
})
module.exports = router