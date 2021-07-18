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

const saveImage = async(req, res, baseImage)=> {
    try{
        //path of folder where you want to save the image.
        const dir = './uploads/user/'
        const localPath = req.session.user;
        const img_dir = dir+localPath
        //Find extension of file
        const ext = baseImage.substring(baseImage.indexOf("/")+1, baseImage.indexOf(";base64"));
        const fileType = baseImage.substring("data:".length,baseImage.indexOf("/"));
        //Forming regex to extract base64 data of file.
        const regex = new RegExp(`^data:${fileType}\/${ext};base64,`, 'gi');
        //Extract base64 data.
        const base64Data = baseImage.replace(regex, "");
        const rand = Math.ceil(Math.random()*1000);
        //Random photo name with timeStamp so it will not overide previous images.
        const filename = `Photo_${Date.now()}_${rand}.${ext}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        if (!fs.existsSync(img_dir)) {
            fs.mkdirSync(img_dir);
        }
        fs.writeFileSync(img_dir+'/'+filename, base64Data, 'base64');
        return localPath+'/'+filename;
    }
    catch(err){
        console.log(err)
        res.sendStatus(444)
    }
    
}
const auth = (req, res, next) => {
    if(req.session.user){
        next()
    }else{
        res.sendStatus(401)
    }
}
router.post('/upload', auth, async(req, res)=> {
    try{

    const files = req.body.files
    const paths = []
    for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const savedImage = await saveImage(req, res,file)
        paths.push(savedImage)
    }
    res.send(paths)
   }catch(err){
            console.log(err)
            res.sendStatus(444)
        } 
})
router.post('/', uploads.array('image'), async (req, res, next)=> {
    const files = req.files
    const paths = []
    files.forEach(image => {
        paths.push(req.session.user+'/'+image.filename)
    });
    res.send(paths)
})
router.post('/change-profile', auth, async (req, res, next)=> {
    try{
        const file = req.body.file
        const path = await saveImage(req, res, file)
        res.send(path)
    }catch(err){
        console.log(err)
        res.sendStatus(444)
    }
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
router.get('/fetch-photos', async(req, res)=> {
    try{
        const images = await ImageModel.find({owner:req.query.id}, null, {limit:6})
        res.send(images)
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
    

})

module.exports = router