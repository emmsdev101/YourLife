import { useEffect,useState } from "react";
import usePeople from "../../logic/usePeople";

const usePeopleList = () => {
    const {fetchPoeple} = usePeople()
    const [people, setPeople] = useState(null)
    useEffect(() => {
        async function initPeople(){
            const res_people = await fetchPoeple()
            if(Array.isArray(res_people)){
                setPeople(res_people)
            }
        } 
        initPeople()
    }, []);
    return {people}

}
export default usePeopleList