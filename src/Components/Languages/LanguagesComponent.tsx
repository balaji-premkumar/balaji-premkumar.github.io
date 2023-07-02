import React from 'react';
import {LanguageBoxProps} from "./LanguagesProps";
import LanguageBox from "../LanguageBox";

const LanguagesComponent = () => {
    return (
        <div className="flex flex-col flex-wrap justify-center overflow-y-auto">
            <div className={"flex flex-wrap justify-center mb-6 bg-amber-100 py-4 items-center"}>
            <h2 className={"text-4xl text-center font-bold underline decoration-red-400"}>Languages</h2>
            </div>
            <div className={"flex flex-row justify-center flex-wrap"}>
            <LanguageBox icon={"devicon-html5-plain colored text-8xl"} name={"HTML"} />
            <LanguageBox icon={"devicon-php-plain colored text-8xl"} name={"PHP"} />
            <LanguageBox icon={"devicon-android-plain colored text-8xl"} name={"Android"} />
            <LanguageBox icon={"devicon-csharp-plain colored text-8xl"} name={"C#"} />
            <LanguageBox icon={"devicon-dotnetcore-plain colored text-8xl"} name={".NET CORE "} />
            <LanguageBox icon={"devicon-dart-plain colored text-8xl"} name={"Dart"} />
            <LanguageBox icon={"devicon-python-plain colored text-8xl"} name={"Python"} />
            <LanguageBox icon={"devicon-nodejs-plain colored text-8xl"} name={"Node.js"} />
            <LanguageBox icon={"devicon-sass-plain colored text-8xl"} name={"SASS"} />
            <LanguageBox icon={"devicon-css3-plain colored text-8xl"} name={"CSS"} />
            <LanguageBox icon={"devicon-javascript-plain colored text-8xl"} name={"javascript"} />
            </div>
        </div>
    );
};

export default LanguagesComponent;