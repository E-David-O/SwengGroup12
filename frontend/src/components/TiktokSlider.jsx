import { useState, useRef, useEffect, useMemo } from "react";
import {
    LeftOutlined,
    RightOutlined,
} from "@ant-design/icons";

export default function TiktokSlider({props}) {
    const [index, setIndex] = useState(0);
    const [width, setWidth] = useState(0);
    const [xPosition, setXPosition] = useState(0);
    const createImages = () => {
        let data = [];
        props.results.forEach((f, i) => {
            data.push(f.image);
        });
        return data;
    }
    const images = useMemo(() => createImages(), [props.results]);
    const handleClickPrev = () => { 
        if (index === 0) return;
        setIndex(index - 1);
        setXPosition(xPosition + width);
        };

    const handleClicknext = () => {
        if (index === images.length - 1) {
            setIndex(0);
            setXPosition(0);
        } else {
            setIndex(index + 1);
            setXPosition(xPosition - width);
        }
        };
    const currentFrame = props.results[index];

    return (
        <div>
            <iframe src={`https://www.tiktok.com/embed/v2/${props.video.file.split("/").slice(-1).toString().split("?")[0]}`} title="tiktok" width="500" height="500"  ></iframe>
                        
                <Carousel
                    images={images}
                    setWidth={setWidth}
                    xPosition={xPosition}
                    handleClickPrev={handleClickPrev}
                    handleClicknext={handleClicknext}
                />
                <p className="m-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-full">Closest Frame Analysis: frame {currentFrame.frame_number} </p>
                <div className="grid grid-cols-3 gap-1 m-2">
                { currentFrame !== null ? currentFrame.results?.map((f, i) => {
                        return <div className="flex content-center justify-between shadow-lg rounded-full hover:bg-blue-900 p-1 text-s" key={i}>Object: {f.class_id}, confidence: {f.conf}</div>
                }) : <p>No objects detected</p>}
                </div>
                <p className="m-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-full">Aggregate Video Analysis</p>
                <div className="grid grid-cols-3 gap-1 m-2">
                { props.data.length !== 0 ? props.data?.map((f, i) => {
                        return <div className="flex content-center justify-between shadow-lg rounded-full hover:bg-blue-900 p-1 text-s" key={i}>Object: {f[0]}, Occurances: {f[1]}</div>
                }) : <p>No Total Results</p>}
                </div>
        </div>
    );
    }

function Carousel({
    images,
    setWidth,
    xPosition,
    handleClickPrev,
    handleClicknext,
  }) {
    const slideRef = useRef();
    useEffect(() => {
    if (slideRef.current) {
      // @ts-ignore
      const width = slideRef.current.clientWidth;
      setWidth(width);
    }
  }, [setWidth]);
    return (
    <div className="relative width-1/2 overflow-hidden shadow-lg">
      <div className='flex transition-transform ease-out duration-500' style={{ transform: `translateX(${xPosition}px)`}} ref={slideRef}>
        {images.length !== 0 ? 
        images?.map((img, i) => (
          <img src={`data:image/jpeg;base64,${img}`} key={i} />
        )) : 
        <p>No images</p>}
      </div>
      <Buttons
        handleClickPrev={handleClickPrev}
        handleClicknext={handleClicknext}
      />
    </div>
  );
}

function Buttons ({handleClickPrev, handleClicknext}) {
    return (
    <div className="absolute z-10 top-1/2 left-0 cursor-pointer right-0 flex justify-between" style={{ transform: `translateY(-50}%)`}}>
      <button onClick={handleClickPrev} ><LeftOutlined style={{ fontSize: '150%', color: 'white'}}></LeftOutlined></button>
      <button onClick={handleClicknext} ><RightOutlined style={{ fontSize: '150%', color: 'white'}}></RightOutlined></button>
    </div>
  );
}

