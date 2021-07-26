const fs = require('fs')


const saveImage = async(req, res, baseImage)=> {
    try{
        const dir = './uploads/user/'
        const localPath = req.session.user;
        const img_dir = dir+localPath

        const ext = baseImage.substring(baseImage.indexOf("/")+1, baseImage.indexOf(";base64"));
        const fileType = baseImage.substring("data:".length,baseImage.indexOf("/"));

        const regex = new RegExp(`^data:${fileType}\/${ext};base64,`, 'gi');

        const base64Data = baseImage.replace(regex, "");
        const rand = Math.ceil(Math.random()*1000);

        const filename = `Photo_${Date.now()}_${rand}.${ext}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        if (!fs.existsSync(img_dir)) {
            fs.mkdirSync(img_dir);
        }
        fs.writeFileSync(img_dir+'/'+filename, base64Data, 'base64');

        const file = {
            filename: filename,
            path: img_dir+'/'+filename,
            location:localPath+'/'+filename
        }
        return file;
    }
    catch(err){
        console.log(err)
        return false
    }
}
module.exports = saveImage