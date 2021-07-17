import { useReactHooks } from "../../logic/library"
    function PostImage ({photosQuant,src, id}){
        const {useState} = useReactHooks()
        const [loaded, setLoaded] = useState(false)
        let temp_img = new Image()
        temp_img.onload = () => {
            setLoaded(true)
        }
        temp_img.src = src
        if(id < 4){
            if(photosQuant === 1){
                if(loaded)return (<img src = {src} id = {id} className = 'single content-photo'></img>)
                else return(<div id = {id} className = 'single content-loading'></div>)
            }else if(photosQuant === 2){
                if(loaded)return (<img src = {src} id = {id} className = 'double content-photo'></img>)
                else return (<div id = {id} className = 'double content-loading'></div>)
            }else if(photosQuant === 3){
                if(id < 2 ){
                    if(loaded)return (<img src = {src} id = {id} className = 'tripple content-photo'></img>)
                    else return (<div id = {id} className = 'tripple content-loading'></div>)
                }else{
                   if(loaded) return (<img src = {src} id = {id} className = 'tripple-row content-photo'></img>)
                   else  return (<div id = {id} className = 'tripple-row content-loading'></div>)
                } 
            }else if(photosQuant > 3){
                if(loaded)return (<img src = {src} id = {id} className = 'quad content-photo'></img>) 
                else return (<div id = {id} className = 'quad content-loading'></div>) 
            }
        }
    }
export default PostImage