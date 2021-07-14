import { FaArrowLeft, FaBackward, FaBars, FaBeer, FaCamera, FaEdit, FaEnvelope, FaMailBulk, FaMailchimp, FaPen, FaPlusCircle, FaUserPlus } from 'react-icons/fa';
import './profile.css'
import testimage1 from '../../res/images/test1.jpg'
import testimage2 from '../../res/images/test2.jpg'
import testimage3 from '../../res/images/test3.jpg'
import testimage4 from '../../res/images/test4.jpg'

import Post from '../../components/post/post'
import { useHistory } from 'react-router-dom';

function Profile(){
    let isOwn =  true
    const history = useHistory()


    function back(){
        history.push("/menu")
    }
    const PhtoItem =({image})=>{
        return(
            <div className = "photo-item-div" style = {{backgroundImage:'url('+image+')'}}>
            </div>
        )
    }
    const FriendItem = ({image})=> {
        return(<>
                <div className = "friends-item-div">
                <div className = "friend-image" style = {{backgroundImage:'url('+image+')'}}>
            </div>
                    <p>Jasper Gequillio</p>
                </div>
        </>)
    }
    return(
        <>
        <header className="App-header">
        <div className = "back-btn-div" onClick = {()=>{back()}}>
          <FaArrowLeft className = "back-icon"/>
          </div>
          <div className = "menu-btn-div">
          <FaBars className = "menu-icon"/>
          </div>
      </header>
      <div className = "profile-header-div">
          <div className = "row1-profile-header">
              <div className = "follower-div">
                  <p className = "follow-count">300</p>
                  <p className = "follow-count-title"> Followers</p>
              </div>
              <div className = "dp-div" style = {{backgroundImage:'url('+testimage3+')'}}>
                {isOwn? <div className = "camera-div" >
                    <FaCamera/>
                </div>:''}
              </div>
              <div className = "following-div">
                  <p className = "follow-count">150</p>
                  <p className = "follow-count-title">Following</p>
              </div>
          </div>
          <div className = "information-div">
              <p className = "fullname">Emmanuel Katipunan</p>
              <p className = "gender">Male</p>
              <p className = "age">22</p>
          </div>
          {!isOwn? <div className = "profile-action">
              <button className = "button-follow"> <FaUserPlus className = "follow-icon"></FaUserPlus> Follow</button>
              <button className = "button-message"> <FaEnvelope className = "message-icon"></FaEnvelope> Message</button>
          </div>:''}
        </div>
        {isOwn? <div className = "editprofile-div">
            <button> <FaPen className= "edit-icon"></FaPen> Edit Profile</button>
        </div>:''}
        <div className = "photos-div">
            <h4>Photos</h4>
            <div className = "photo-list-div">
                <PhtoItem image = {testimage1}></PhtoItem>
                <PhtoItem image = {testimage2}></PhtoItem>
                <PhtoItem image = {testimage3}></PhtoItem>
                <PhtoItem image = {testimage4}></PhtoItem>
            </div>
            <div className = "generic-button-div">
            <button> See more</button>
        </div>
        </div>
        <div className = "friends-div">
            <h4>Followers</h4>
            <div className = "friends-list-div">
                <FriendItem image = {testimage1}></FriendItem>
                <FriendItem image = {testimage2}></FriendItem>
                <FriendItem image = {testimage3}></FriendItem>
                <FriendItem image = {testimage4}></FriendItem>
                <FriendItem image = {testimage4}></FriendItem>
                <FriendItem image = {testimage4}></FriendItem>
            </div>
            <div className = "generic-button-div">
            <button> See more followers</button>
        </div>
        </div>
        <h2 className = "section-title">  Stories</h2>
        {isOwn?  <div className = "primary-button">
            <button> <FaPlusCircle className = "primary-button-icon"></FaPlusCircle>Share a story</button>
        </div>:''}

        <div className = "stories-div">
            <div className = "post-div-list">
            <Post content = "the quick brown fox jumps over the lazy dog and the dog got angy so the dog chased the brown fox. But the brown fox is quicker than the dog so the dog didn't catched the brown fox" hasphoto = {true}></Post>
            <Post content = "What is Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book it has?"></Post>
            <Post content = "the quick brown fox jumps over the lazy dog and the dog got angy so the dog chased the brown fox. But the brown fox is quicker than the dog so the dog didn't catched the brown fox"></Post>
            </div>
        </div>
        </>
    )
    
}

export default Profile