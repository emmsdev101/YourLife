import { useEffect, useState } from "react";
import usePeople from "../../logic/usePeople";

const usePeopleList = (setRenderHeader) => {
  const [page, setPage] = useState(1)
  const { fetchPoeple, searchPeople } = usePeople();
  const [people, setPeople] = useState(null);
  const [loading, setLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  useEffect(() => {
    initPeople();
  }, []);
  useEffect(() => {
      async function searchReq() {
        setPeople(null)
        const searchResult = await searchPeople(searchInput)
        if(searchResult){
          setPeople(searchResult)
        }
      }
      if(isSearching){
        searchReq()
      }
  }, [searchInput])

  async function initPeople() {
    const res_people = await fetchPoeple(0);
    if (Array.isArray(res_people)) {
      setPeople(res_people);
    }
  }

  const loadMore = async () => {
    setLoading(true)
    const res_people = await fetchPoeple(page);
    if (Array.isArray(res_people)) {
        setPage(page+1)
      setPeople(olds=>[...olds,  ...res_people])
      setLoading(false)
    }else{
        setLoading(false)
    }
    
  };
  const toggleSearch = ()=> {
    if(isSearching){
      setRenderHeader(true)
    }else setRenderHeader(false)
    setIsSearching(!isSearching)
    initPeople()
  }
  const registerInput = (e)=>{
    setSearchInput(e.target.value)
  }
  return { people, loading, loadMore, toggleSearch, isSearching, searchInput, registerInput};
};
export default usePeopleList;
