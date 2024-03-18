import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';


export const VideoJS = (props) => {
    const videoReference = useRef(null);
    const playerReference = useRef(null);
    const {options, onReady} = props;
    
    useEffect(() => {
       // Initializing video.js player
       if (!playerReference.current) {
          const videoElement = videoReference.current;
          if (!videoElement) return;
          const player = playerReference.current =
          videojs(videoElement, options, () => {
             videojs.log('Video player is ready');
             onReady && onReady(player);
          });
          
       }
    }, [options, videoReference]);
 
    // Destroy video.js player on component unmount
    useEffect(() => {
       const player = playerReference.current;
       return () => {
          if (player) {
             player.dispose();
             playerReference.current = null;
          }
       };
    }, [playerReference]);
    // wrap player with data-vjs-player` attribute
    // so no additional wrapper are created in the DOM
    return (
        <>
       <div data-vjs-player>
          <video id="my-player" ref={videoReference} className='video-js vjs-big-playcentered'/>
       </div>
       
       {/* { playerReference.current && playerReference.current.duration() ?
        <>
        <p>{playerReference.current.duration()}</p>
        <p>{playerReference.current.currentTime()}</p>
        </>
          : null } */}
        </>
    );
 }
 export default VideoJS;