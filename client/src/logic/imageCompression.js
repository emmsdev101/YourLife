function imageCompression(){
    const getUrlImage = async (file, cb) =>{
        let reader = new FileReader()
         reader.readAsArrayBuffer(file)
         reader.onload = (ev)=>{
            var blob = new Blob([ev.target.result]); 
            window.URL = window.URL || window.webkitURL;
            var blobURL = window.URL.createObjectURL(blob); 
            var image = new Image();
            image.src = blobURL;
            image.onload = async function() {
                var resized = await resizeMe(image); 
                cb(resized)
            }
        }
        async function resizeMe(img) {
            const max_height = 1000
            const max_width =  1000
            var canvas = document.createElement('canvas');
          
            var width = img.width;
            var height = img.height;
          
            if (width > height) {
              if (width > max_width) {
                height = Math.round(height *= max_width / width);
                width = max_width;
              }
            } else {
              if (height > max_height) {
                width = Math.round(width *= max_height / height);
                height = max_height;
              }
            }
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);        
            return canvas.toDataURL("image/jpeg",0.3);
        }
    }
    return {getUrlImage}
}
export default imageCompression