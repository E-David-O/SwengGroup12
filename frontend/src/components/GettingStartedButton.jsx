import {useState} from 'react';

const GetStartedButton = () => {

    const [hoverOver, setHoverOver] = useState(false);

    const svgHover = "fill-blue-300"
    const svgNormal = "fill-white"
    const textHover = "text-blue-300"
    const textNormal = "text-white"
  
    return (
      <button
        className="items-center justify-center space-x-2 bg-blue-400 hover:bg-white hover:ring-blue-300 hover:ring-offset-blue-200 text-white transition ease-in duration-200 text-center shadow-md hover:outline-none hover:ring-2 hover:ring-offset-2 rounded-lg w-32 h-12"
        onMouseEnter={() => setHoverOver(true)}
        onMouseLeave={() => setHoverOver(false)}
      >
        <span className={`${hoverOver ? textHover: textNormal}`}>Get Started</span>
      </button>
    );
  };
  
export default GetStartedButton;