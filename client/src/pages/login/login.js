
import { useCustomHooks, useReactHooks } from '../../logic/library';
import './loginStyle.css'
import logo_text from './../../res/images/logo_text.svg';
import {MY_API} from './../../config'
function Login(){
    const {useState, useHistory, Cookies, useContext, axios} = useReactHooks()
    const {GlobalUserActionsContext} = useCustomHooks()
    const my_api = MY_API
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const history = useHistory()
    const cookies = new Cookies()

    const set_user_context = useContext(GlobalUserActionsContext);

    const usernameChage = (e)=> {
        setUsername(e.target.value)
    }
    const passwordChage = (e)=> {
        setPassword(e.target.value)
    }
    const signIn = async() =>{
        setLoading(true)
        const res = await axios({
            method: 'post',
            withCredentials: true,
            url:my_api+'/user/login',
            data: {
                username:username,
                password:password,
            }
          });

        if(res.status === 200){
            setLoading(false)
          if(res.data.wrong_password){
            setErrorMessage("Wrong password")
          }else if(res.data.wrong_user){
              setErrorMessage("Wrong username")
          }
          else{
              cookies.set('username', res.data.username)
              set_user_context(res.data)
              window.location.replace('/')
          }
        }else{
            alert('Error')
            setLoading(false)
        }
    }
    const errorCard = () => {
        return(
            <div className = "error-card">
                <p>{errorMessage}</p>
            </div>
        )
    }
    return (
        <div className = "signup">
            <div className = "signup-header">
                <img src = {logo_text} alt = ''/>
            </div>
              {errorMessage?errorCard():''}
            <div className = "signup-body">
                
                <label htmlFor = "fname-input"> Username:</label>
                <input type = "username" className = "signup-input" id = "username-input" value = {username} onChange = {usernameChage}/>
                <label htmlFor = "fname-input"> Password:</label>
                <input type = "password" className = "signup-input" id = "password-input" value = {password} onChange = {passwordChage}/>
                <button className = {loading?'loading':"signup-submit"} onClick = {signIn}>{loading?"Logging in...":'Login'}</button>
                <center>or</center>
                <button className = "signup-btn" onClick = {()=>{history.push('/signup')}}>Signup</button>
                <center>If you dont have an account yet</center>
            </div>
        </div>
    )
}
export default Login