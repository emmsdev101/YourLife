import { useReactHooks } from '../../logic/library';
import axios from 'axios'
import './style.css'
import {MY_API} from './../../config'
function Signup(){
    const {useState} = useReactHooks()
    const [firstname, setFirstname] = useState('');
    const [lastname, setLatname] = useState('');
    const [gender, setGender] = useState('male');
    const [age, setAge] = useState();
    const [password, setPassword] = useState('');
    const [retype, setRetype] = useState('')
    const [username, setUsername] = useState('');
    const [next, setNext] = useState(0)
    const [fieldError, setFieldError] = useState({})
    const [passwordError, setPasswordError] = useState('')
    const [usernameError, setEmailError] = useState('')
    const [loading, setLoading] = useState(false)
    
    const my_api = MY_API
    const USER_API = my_api+'/user/register'
    const gender_options = [
        {
            label: 'Male',
            value: 'male'
        },
        {
            label: 'Female',
            value: 'female'
        }
    ]
    
    async function signUp(){
        setLoading(true)
        const registerReq = await axios({
            method:'post',
            headers:{'content-type': 'application/json'},
            withCredentials:true,
            url:USER_API,
            data:{
                username:username,
                password:password,
                firstname:firstname,
                lastname:lastname,
                gender:gender,
                age:age
            }
        })
        if(registerReq.status === 200){
            setLoading(false)
            const data = registerReq.data

            if(data.success){
                window.location.replace("/login")
            }else{
                if(data.emailError){
                    setEmailError(data.emailError)
                }
            }

            
        }else{
        }
    }
    const genderOnchange = (e) => {
        setGender(e.target.value)
    }
    const proceed = () => {
        setFieldError({
            firstname:!firstname,
            lastname:!lastname,
            age:!age,
        })
        if(firstname && lastname && age && gender){
            setNext(1)
        }
    
    }
    const submit = () =>{
        setFieldError({
            firstname:!firstname,
            lastname:!lastname,
            age:!age,
            username:!username,
            password:!password,
            retype:!retype
        })
        if(password !== retype){
            setPasswordError('Password do not match')
        }else{
            signUp()
        }

    }
    const firstPart = (e) => {
        return(
            <div className = "signup-body">
                <label htmlFor = "fname-input"> First name:</label>
                {fieldError.firstname?<label className = "field-warning">This field is required</label>:''}
                <input type = "text" className = {fieldError.firstname?"signup-input input-warning":'signup-input'} id = "fname-input" onChange = {(e)=>{
                    setFirstname(e.target.value)
                }} value = {firstname} required/>
                <label htmlFor = "fname-input"> Last name:</label>
                {fieldError.lastname?<label className = "field-warning">This field is required</label>:''}
                <input type = "text" className = {fieldError.lastname?"signup-input input-warning":'signup-input'} id = "fname-input" onChange = {(e)=>{
                    setLatname(e.target.value)
                }} value = {lastname} required/>
                <label htmlFor = "fname-input"> Age:</label>
                {fieldError.age?<label className = "field-warning">This field is required</label>:''}
                <input type = "number" className = {fieldError.age?"signup-input input-warning":'signup-input'} id = "fname-input" id = "age-input" onChange = {(e)=>{
                    setAge(e.target.value)
                }} value = {age} required/>
                <label htmlFor = "fname-input"> Gender:</label>
                <select className = "signup-input" name = "gender" id = "gender" value = {gender} onChange = {genderOnchange}>
                    {gender_options.map((item)=>(
                        <option value = {item.value}>{item.label}</option>
                    ))}
                </select>
                <button className = "signup-submit" onClick = {()=>{proceed()}}>Next</button>
            </div>
        )
    }
    const secondPart = () => {
        return (
            <div className = "signup-body">
                <label htmlFor = "fname-input"> Username:</label>
                {fieldError.username || usernameError?<label className = "field-warning">{usernameError?usernameError:'This field is required'}</label>:''}
                <input type = "username" className = {fieldError.username?"signup-input input-warning":'signup-input'} id = "username-input" onChange = {(e)=>{
                    setUsername(e.target.value)
                }} value = {username} required/>
                <label htmlFor = "fname-input"> Password:</label>
                {fieldError.password?<label className = "field-warning">This field is required</label>:''}
                <input type = "password" className = {fieldError.password?"signup-input input-warning":'signup-input'} id = "password-input" onChange = {(e)=>{
                    setPassword(e.target.value)
                }} value = {password} required/>
                <label htmlFor = "fname-input"> Re-type Password:</label>
                {fieldError.retype || passwordError?<label className = "field-warning">{passwordError?passwordError:'This field is required'}</label>:''}
                <input type = "password" className = {fieldError.retype?"signup-input input-warning":'signup-input'} id = "repassword-input" onChange = {(e) => {
                    setRetype(e.target.value)
                }}/>
                <button className = {loading?"loading":"signup-submit"} onClick = {()=>{submit()}} disabled = {loading}>{loading?"Loading...":"Submit"}</button>
                
            </div>
        )
    }
    return (
        <div className = "signup">
            <div className = "signup-header">
                <h2>Signup</h2>
            </div>
            {next === 0?firstPart():secondPart()}
            <p className = 'login-link'> Already have an accout? <a href = '/login'>Login here</a></p>
        </div>
    )
}
export default Signup