import React from 'react';
import mypic from "../../images/mypic.jpg";

const AboutComponent = () => {
    return (
        <div className="flex flex-col items-center md:justify-center h-full p-8 space-y-8">
            <img
                src={mypic}
                alt="Balaji Premkumar"
                className="w-72 h-72 rounded-full object-cover"
            />
            <h1 className="text-4xl font-bold">Balaji Premkumar</h1>
            <p className="text-4xl text-center">
                Full Stack Engineer
            </p>
            <p className={"md:text-3xl text-xl text-justify"}>
                A 10-year-old full-stack engineer with expertise in frontend, backend, databases, and server
                technologies. Possesses a strong foundation in both client-side and server-side development, along with
                the ability to work with various databases. Skilled in building robust and scalable web applications,
                utilizing a wide range of technologies and frameworks. Demonstrates a passion for learning and staying
                up-to-date with the latest industry trends.
            </p>
        </div>
    );
};

export default AboutComponent;