import style from './people.module.css'
import User from '../../components/people/user'
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import usePeople from '../../logic/usePeople';
import usePeopleList from './usePeopleList';
import Loader from '../../components/Loader/Loader';
function People({setRenderHeader}){
    const {people, loading, loadMore, toggleSearch, isSearching, searchInput, registerInput} = usePeopleList(setRenderHeader)
    return(
        <div className = {style.people}>
                {isSearching?
                <div className = {style.searchHeader}>
                    <div className = {style.searchBack} onClick = {toggleSearch}><FaArrowLeft/></div>
                    <div className = {style.searchDiv}>
                        <input type = "text" placeholder = "Search People" className = {style.searchInput} onChange = {registerInput} value = {searchInput}></input>
                        <FaSearch className = {style.searchIcon}></FaSearch>
                    </div>
                </div>:
                <div className = {style.headingTool}>
                    <h3 className = {style.headingTitle}>Follow People</h3>
                    <button className = {style.searchButton} onClick = {toggleSearch}><FaSearch className = {style.searchIcon}></FaSearch></button>
                </div>}
            <div className = {style.peopleList}>
                    {people !== null? people.map((user,id)=>(
                        <User  data = {user} key = {id} id = {id}/>
                    )):
                    <div>
                    <h3>Loading...</h3>
                    <Loader/>
                    </div>
                    }
                    
                    {loading?<div>
                    <h3>Loading...</h3>
                    <Loader/>
                    </div>:people !== null && !isSearching?<div className = {style.loadMore} onClick = {loadMore}>Load more</div>:''}
            </div>
      </div>
    )
}
export default People