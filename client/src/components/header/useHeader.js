import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

const useHeader = () =>{
    const [active, setActive] = useState("");
    const history = useHistory();
    const location = useLocation()
    const isMounted = useRef(false)

    useEffect(() => {
        isMounted.current = true
        if(isMounted.current){
            setActive(location.pathname)
        }
        return () => {
            isMounted.current = false
        };
    }, [location.pathname]);

    function switchPage(page) {
        history.push(page);
      }
      
    return {switchPage, setActive, active}
}
export default useHeader