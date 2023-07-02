import React, {useEffect, useState} from 'react';
import {Link, useLocation} from "react-router-dom";
import {FaBriefcase, FaCode, FaDatabase, FaEnvelope, FaHome, FaPaintBrush} from "react-icons/fa";

const SidebarComponent = (props: any) => {
    const [activeMenu, setActiveMenu] = useState('home');
    const location = useLocation();
    const setMenuItem = (menuname: string) => {
        setActiveMenu(menuname);
        if (props.toggleSidebar) {
            props.toggleSidebar();
        }
    }
    useEffect(() => {
        let pathName = location.pathname;
        pathName = pathName.replace("/", "");
        setActiveMenu(pathName);
    }, [location]);


    return (
        <div className="h-screen sticky top-0 bg-gray-900 text-white flex flex-col justify-between text-2xl">
            <div className="flex-grow flex flex-col justify-start p-4">
                {props.showHeader && (
                    <div className="text-4xl font-bold border-b border-gray-700 mb-4 pb-4">Balaji Premkumar</div>
                )}
                {/* Navigation links */}
                <Link to="/" onClick={() => setMenuItem('home')}
                      className={`flex items-center py-4 px-6 mb-4 rounded-2xl ${activeMenu === 'home' ? 'bg-gray-700 shadow-2xl' : ''}`}>
                    <FaHome className="mr-6 text-2xl"/>
                    <span>Home</span>
                </Link>

                <Link to="/languages" onClick={() => setMenuItem('languages')}
                      className={`flex items-center py-4 px-6 mb-4 rounded-2xl ${activeMenu === 'languages' ? 'bg-gray-700 shadow-2xl' : ''}`}>
                    <FaCode className="mr-6 text-2xl"/>
                    <span>Languages</span>
                </Link>
                <Link to="/databases" onClick={() => setMenuItem('databases')}
                      className={`flex items-center py-4 px-6 mb-4 rounded-2xl ${activeMenu === 'databases' ? 'bg-gray-700 shadow-2xl' : ''}`}>
                    <FaDatabase className="mr-6 text-2xl"/>
                    <span>Databases</span>
                </Link>
                <Link to="/ui-frameworks" onClick={() => setMenuItem('ui-frameworks')}
                      className={`flex items-center py-4 px-6 mb-4 rounded-2xl ${activeMenu === 'ui-frameworks' ? 'bg-gray-700 shadow-2xl' : ''}`}>
                    <FaPaintBrush className="mr-6 text-2xl"/>
                    <span>UI & Frameworks</span>
                </Link>
                <Link to="/experience" onClick={() => setMenuItem('experience')}
                      className={`flex items-center py-4 px-6 mb-4 rounded-2xl ${activeMenu === 'experience' ? 'bg-gray-700 shadow-2xl' : ''}`}>
                    <FaBriefcase className="mr-6 text-2xl"/>
                    <span>Experience</span>
                </Link>
                <Link to="/contact" onClick={() => setMenuItem('contact')}
                      className={`flex items-center py-4 px-6 mb-4 rounded-2xl ${activeMenu === 'contact' ? 'bg-gray-700 shadow-2xl' : ''}`}>
                    <FaEnvelope className="mr-6 text-2xl"/>
                    <span>Contact</span>
                </Link>
            </div>
        </div>
    )
};

export default SidebarComponent;