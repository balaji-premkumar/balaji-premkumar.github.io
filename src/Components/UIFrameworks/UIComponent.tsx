import React from 'react';
import LanguageBox from "../LanguageBox";

const UiComponent = () => {
    return (
        <div className="flex flex-col flex-wrap justify-center overflow-y-auto">
            <div className={"flex flex-wrap justify-center mb-6 bg-amber-100 py-4 items-center"}>
                <h2 className={"text-4xl text-center font-bold underline decoration-red-400"}>UI & Framworks</h2>
            </div>
            <div className={"flex flex-row justify-center flex-wrap"}>
                <LanguageBox icon={"devicon-codeigniter-plain colored text-8xl"} name={"Codeigniter"} />
                <LanguageBox icon={"devicon-laravel-plain colored text-8xl"} name={"Laravel"} />
                <LanguageBox icon={"devicon-wordpress-plain colored text-8xl"} name={"WordPress"} />
                <LanguageBox icon={"devicon-drupal-plain colored text-8xl"} name={"Drupal"} />
                <LanguageBox icon={"devicon-flutter-plain colored text-8xl"} name={"Flutter"} />
                <LanguageBox icon={"devicon-react-plain colored text-8xl"} name={"React.JS"} />
                <LanguageBox icon={"devicon-angularjs-plain colored text-8xl"} name={"Angular.JS"} />
                <LanguageBox icon={"devicon-express-plain colored text-8xl"} name={"Express.JS"} />
                <LanguageBox icon={"devicon-jquery-plain colored text-8xl"} name={"Jquery"} />
                <LanguageBox icon={"devicon-selenium-original colored text-8xl"} name={"Selenium"} />
            </div>
        </div>
    );
};

export default UiComponent;