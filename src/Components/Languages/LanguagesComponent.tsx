import React from 'react';
import {LanguageBoxProps} from "./LanguagesProps";
import {FaAndroid, FaHtml5, FaPhp} from "react-icons/fa";
import {SiCsharp, SiPython} from "react-icons/si";
import {DiCss3, DiDotnet, DiJavascript1, DiNodejsSmall, DiSass} from "react-icons/di";

const LanguagesComponent = () => {
    return (
        <div className="flex flex-col flex-wrap justify-center">
            <div className={"flex flex-wrap justify-center mb-6 bg-amber-100 py-4 items-center"}>
            <h2 className={"text-4xl text-center font-bold underline decoration-red-400"}>Languages</h2>
            </div>
            <div className={"flex flex-row justify-center flex-wrap"}>
            <LanguageBox icon={"devicon-html5-plain colored text-8xl"} name={"HTML"} />
            <LanguageBox icon={"devicon-php-plain colored text-8xl"} name={"PHP"} />
            <LanguageBox icon={"devicon-android-plain colored text-8xl"} name={"Android"} />
            <LanguageBox icon={"devicon-csharp-plain colored text-8xl"} name={"C#"} />
            <LanguageBox icon={"devicon-dotnetcore-plain colored text-8xl"} name={".NET"} />
            <LanguageBox icon={"devicon-python-plain colored text-8xl"} name={"Python"} />
            <LanguageBox icon={"devicon-nodejs-plain colored text-8xl"} name={"Node.js"} />
            <LanguageBox icon={"devicon-sass-plain colored text-8xl"} name={"SASS"} />
            <LanguageBox icon={"devicon-css3-plain colored text-8xl"} name={"CSS"} />
            <LanguageBox icon={"devicon-javascript-plain colored text-8xl"} name={"javascript"} />
            </div>
        </div>
    );
};

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

export default LanguagesComponent;