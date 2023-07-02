import React from 'react';
import LanguageBox from "../LanguageBox";

const DatabasesComponent = () => {
    return (
        <div className="flex flex-col flex-wrap justify-center overflow-y-auto">
            <div className={"flex flex-wrap justify-center mb-6 bg-amber-100 py-4 items-center"}>
                <h2 className={"text-4xl text-center font-bold underline decoration-red-400"}>Databases</h2>
            </div>
            <div className={"flex flex-row justify-center flex-wrap"}>
                <LanguageBox icon={"devicon-mysql-plain-wordmark colored text-8xl"} name={"MySQL"} />
                <LanguageBox icon={"devicon-microsoftsqlserver-plain-wordmark colored text-8xl"} name={"MsSQL"} />
                <LanguageBox icon={"devicon-sqlite-plain-wordmark colored text-8xl"} name={"SQLite"} />
                <LanguageBox icon={"devicon-mongodb-plain colored text-8xl"} name={"MongoDB"} />
                <LanguageBox icon={"devicon-redis-plain colored text-8xl"} name={"Redis"} />
            </div>
        </div>
    );
};

export default DatabasesComponent;