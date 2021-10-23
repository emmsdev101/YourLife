import { useEffect, useState } from "react";
import usePeople from "../../logic/usePeople";

const usePeopleList = () => {
  const [page, setPage] = useState(1)
  const { fetchPoeple } = usePeople();
  const [people, setPeople] = useState(null);
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    async function initPeople() {
      const res_people = await fetchPoeple(0);
      if (Array.isArray(res_people)) {
        setPeople(res_people);
      }
    }
    initPeople();
  }, []);
  useEffect(() => {
      console.log(people)
  }, [people])
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
  return { people, loading, loadMore };
};
export default usePeopleList;
