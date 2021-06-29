import { useHistory } from 'react-router-dom'
import { useState } from "react";
import axios from 'axios';
import './style.css'
import Cookies from 'universal-cookie'
function Login(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory()
    const cookies = new Cookies()

    const USER_API = 'https://your-life-amazing.herokuapp.com/user/login'
    const USER_FETCH = 'https://your-life-amazing.herokuapp.com/fetchAll'
    const server_api = "https://yourlife-emmsdevs.herokuapp.com"

    const usernameChage = (e)=> {
        setUsername(e.target.value)
    }
    const passwordChage = (e)=> {
        setPassword(e.target.value)
    }
    const signIn = async() =>{
        const res = await axios({
            method: 'post',
            withCredentials: true,
            url: server_api+'/user/login',
            data: {
                username:username,
                password:password,
            }
          });

        if(res.status === 200){
          if(res.data.wrong_password){
              alert('Wrong Password')
          }else if(res.data.wrong_user){
              alert('Wrong username')
          }
          else{
              cookies.set('username', res.data.username)
              window.location.replace('/')
          }
        }else{
            alert('Error')
        }
    }
   async function getUsers(){
        const fetched_user = await axios({
            method:'get',
            withCredentials: true,
            url: server_api+'/fetchAll',
        })
        console.log(fetched_user.data)
    }


    return (
        <div className = "signup">
            <div className = "signup-header">
                <h2>Login</h2>
            </div>  
            <div className = "signup-body">
                <label for = "fname-input"> Username:</label>
                <input type = "username" className = "signup-input" id = "username-input" value = {username} onChange = {usernameChage}/>
                <label for = "fname-input"> Password:</label>
                <input type = "password" className = "signup-input" id = "password-input" value = {password} onChange = {passwordChage}/>
                <button className = "signup-submit" onClick = {signIn}>Submit</button>
                <center>or</center>
                <button className = "signup-btn" onClick = {()=>{history.push('/signup')}}>Signup</button>
                <center>If you dont have an account yet</center>
            </div>

        </div>
    )
}
export default Login