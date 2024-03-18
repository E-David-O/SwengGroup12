import {useState} from 'react';

const LoginButton = () => {

    const [hoverOver, setHoverOver] = useState(false);

    const svgHover = "fill-green-500"
    const svgNormal = "fill-white"
    const textHover = "text-green-500"
    const textNormal = "text-white"
  
    return (
      <button
        className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-white hover:ring-green-500 hover:ring-offset-green-200 text-white transition ease-in duration-200 text-center shadow-md hover:outline-none hover:ring-2 hover:ring-offset-2 rounded-lg w-32 h-12"
        onMouseEnter={() => setHoverOver(true)}
        onMouseLeave={() => setHoverOver(false)}
      >
        <span className={`${hoverOver ? textHover: textNormal}`}>Log-in</span>
      </button>
    );
  };
  
export default LoginButton;
