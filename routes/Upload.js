const router = require('express').Router()
const path = require('path')
const fs = require('fs')
const multer = require('multer')

const ImageModel = require('./../model/photo')

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        const dir = './uploads/user/'+req.session.user;
        // check if directory exists
        if (!fs.existsSync(dir)) {
            fs.mkdir(dir, (err)=>{
                if(err){
                    console.log(err)
                    cb(err, null)
                }
            })
        }
        cb(null, dir)
    },
    filename:function (req, file, cb){
        cb(null, req.session.user+Date.now()+file.originalname)
    }
})
const uploads = multer({storage:storage})

const auth = (req, res, next) => {
    if(req.session.user){
        next()
    }else{
        res.sendStatus(401)
    }
}
router.post('/', uploads.array('image'), async (req, res, next)=> {
    const files = req.files
    const paths = []
    files.forEach(image => {
        paths.push(req.session.user+'/'+image.filename)
    });
    res.send(paths)
})

router.get('/', auth, (req, res) => {
    const uploadsDirectory = path.join('uploads')
    fs.ReadStream(uploadsDirectory, (err, files) => {
        if(err){
            return res.json({msg:err})
        }
        if(files.lenght === 0){
           return res.json({msg:"No files uploaded"})
        }
        return res.json({files})
    })

})
router.get('/post/', auth, async(req, res)=>{
    try{
        const fetch_res = await ImageModel.find({
            post_id: req.query.id
        })
        res.send(fetch_res)
    }catch(err){
        res.sendStatus(500)
    }
})
router.get('/fetch-all', async(req, res)=> {
    ImageModel.find({}, function(err, doc){
        if(err)return console.log(err)
        res.send(doc)
    })
})
module.exports = router