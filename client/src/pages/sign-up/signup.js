import './style.css'

import { useState } from "react";
function Signup(){
    const [firstname, setFirstname] = useState('');
    const [lastname, setLatname] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState();
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    
    const my_api = process.env.NODE_ENV === 'development'? 'http://localhost:4000' : ''
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
        const user = await fetch(USER_API, {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                username:username,
                password:password,
                firstname:firstname,
                lastname:lastname,
                gender:gender,
                age:age
            })
        })
        if(user.ok){
            const data = await user.json()
            console.log(data)
            alert(user.status)
        }else{
            console.log(user.status)
        }
    }
    const genderOnchange = (e) => {
        setGender(e.target.value)
    }
    return (
        <div className = "signup">
            <div className = "signup-header">
                <h2>Signup</h2>
            </div>  
            <div className = "signup-body">
                <label for = "fname-input"> First name:</label>
                <input type = "text" className = "signup-input" id = "fname-input" onChange = {(e)=>{
                    setFirstname(e.target.value)
                }} value = {firstname}/>
                <label for = "fname-input"> Last name:</label>
                <input type = "text" className = "signup-input" id = "lname-input" onChange = {(e)=>{
                    setLatname(e.target.value)
                }} value = {lastname}/>
                <label for = "fname-input"> Age:</label>
                <input type = "number" className = "signup-input" id = "age-input" onChange = {(e)=>{
                    setAge(e.target.value)
                }} value = {age}/>
                <label for = "fname-input"> Gender:</label>
                <select className = "signup-input" name = "gender" id = "gender" value = {gender} onChange = {genderOnchange}>
                    {gender_options.map((item)=>(
                        <option value = {item.value}>{item.label}</option>
                    ))}
                </select>
                <label for = "fname-input"> Username:</label>
                <input type = "username" className = "signup-input" id = "username-input" onChange = {(e)=>{
                    setUsername(e.target.value)
                }} value = {username}/>
                <label for = "fname-input"> Password:</label>
                <input type = "password" className = "signup-input" id = "password-input" onChange = {(e)=>{
                    setPassword(e.target.value)
                }} value = {password}/>
                <label for = "fname-input"> Re-type Password:</label>
                <input type = "password" className = "signup-input" id = "repassword-input"/>
                <button className = "signup-submit" onClick = {()=>{signUp()}}>Submit</button>
            </div>

        </div>
    )
}
export default Signup