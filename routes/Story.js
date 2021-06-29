const Story = require('./../model/story')
const Photo = require('./../model/photo')
const bcrypt = require("bcrypt");
const router = require('express').Router()

const auth = (req, res, next) => {
    if(req.session.user){
        next()
    }else{
        res.sendStatus(401)
    }
}
router.post('/create', auth, async(req, res, next)=>{
    const data = new Story({
        owner:req.body.owner,
        content:req.body.content,
        images:req.body.images,
        likes:0,
        comments:0
        })
        const img_paths = req.body.imagePath
        console.log(img_paths)
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
                    console.log('Photo saved in: '+saved_photo.path)
                })
            });
            res.send(post)
        })

})
router.get('/all-feeds', auth, async(req, res, next)=>{
    try{
        const feeds = await Story.find().sort({date:-1})
        res.send(feeds)
    }catch(error){
        console.log(error)
    }
})
module.exports = router