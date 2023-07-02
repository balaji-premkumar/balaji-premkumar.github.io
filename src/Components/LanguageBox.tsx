import React from 'react';
import {LanguageBoxProps} from "./Languages/LanguagesProps";
const LanguageBox = (props:LanguageBoxProps) =>{
    const [isHovered, setIsHovered] = React.useState(false);

    const handleHover = () => {
        setIsHovered(!isHovered);
    };

    return (
        <div
            className={`w-72 h-72 bg-white rounded-lg p-4 m-2 flex flex-col items-center justify-center cursor-pointer transition duration-300 ease-in-out ${isHovered?"shadow-xl":"shadow"}`}
            onMouseEnter={handleHover}
            onMouseLeave={handleHover}
        >
            <i className={props.icon}></i>
            <h3 className="text-4xl font-semibold">{props.name}</h3>
        </div>
    );
}

export default LanguageBox;