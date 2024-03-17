import {useState} from 'react';

const NavbarButton = ({buttonText}) => {

    const [hoverOver, setHoverOver] = useState(false);

    const svgHover = "fill-slate-300"
    const svgNormal = "fill-white"
    const textHover = "text-slate-300"
    const textNormal = "text-white"
  
    return (
      <button
        className="flex items-center justify-center space-x-2 bg-slate-400 hover:bg-white hover:ring-slate-300 hover:ring-offset-slate-200 text-white transition ease-in duration-200 text-center shadow-md hover:outline-none hover:ring-2 hover:ring-offset-2 rounded-2xl w-32 h-12"
        onMouseEnter={() => setHoverOver(true)}
        onMouseLeave={() => setHoverOver(false)}
      >
        <span className={`${hoverOver ? textHover: textNormal}`}>{buttonText}</span>
      </button>
    );
  };
  
export default NavbarButton;