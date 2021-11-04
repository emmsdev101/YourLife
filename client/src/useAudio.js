import React, { useState, useEffect } from "react";
const useAudio = (url) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if(playing){
      setPlaying(false);
      setPlaying(true)
    }else{
      setPlaying(true)
    }
  }
  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing]);

  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, []);
  return [playing, toggle];
};
export default useAudio;
