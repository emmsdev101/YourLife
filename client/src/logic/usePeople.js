import {useState, useEffect} from 'react'
import axios from 'axios'
function usePeople(){
    const my_api = process.env.NODE_ENV === 'development'? 'http://localhost:4000' : ''
    const [people, setPoeple] = useState([]);

    
    useEffect(() => {
        fetchPoeple()
    }, []);

  const fetchPoeple = async()=>{
        const fetch_res = await axios({
            method:'get',
            withCredentials: true,
            url:  my_api+'/user/fetchAll'
        })
        if(fetch_res.status === 200){
            setPoeple(fetch_res.data)
        }
    }
    const getUserInfo = async(username) =>{
        const userInfo = await axios({
          method : 'get',
                withCredentials: true,
                url :  my_api+'/user/account',
                params:{
                    id: username
                }
        })
        if(userInfo.status === 200){
            return userInfo.data
        }else{
            console.log(userInfo.status)
            return null
            
        }
      }

    return {people, getUserInfo}
}
export default usePeople