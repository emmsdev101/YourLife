import style from './people.module.css'
import User from '../../components/people/user'
import { FaSearch } from 'react-icons/fa';
import usePeople from '../../logic/usePeople';
import usePeopleList from './usePeopleList';
import Loader from '../../components/Loader/Loader';
function People(){
    const {people} = usePeopleList()
    return(
        <div className = {style.people}>
                <div className = {style.headingTool}>
                    <h3 className = {style.headingTitle}>Follow more</h3>
                    <button className = {style.searchButton}><FaSearch className = {style.searchIcon}></FaSearch></button>
                </div>
            <div className = {style.peopleList}>
                    {people !== null? people.map((user,id)=>(
                        <User  data = {user} key = {id} id = {id}/>
                    )):
                    <div>
                    <h3>Loading...</h3>
                    <Loader/>
                    </div>
                    }
            </div>
      </div>
    )
}
export default People