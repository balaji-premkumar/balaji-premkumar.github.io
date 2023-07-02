import React, {useState} from 'react';
import {HashRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import SidebarComponent from "./Components/Sidebar/SidebarComponent";
import LanguagesComponent from "./Components/Languages/LanguagesComponent";
import DatabasesComponent from "./Components/Databases/DatabasesComponent";
import UIComponent from "./Components/UIFrameworks/UIComponent";
import ExperienceComponent from "./Components/Experience/ExperienceComponent";
import ContactComponent from "./Components/Contact/ContactComponent";
import {FiMenu} from "react-icons/fi";
import AboutComponent from "./Components/About/AboutComponent";

function App() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    }
    return (
        <Router>
            <div className="md:flex font-sans overflow-y-auto">
                <div className="flex justify-between items-center md:hidden mx-4">
                    <h1 className={"font-sans font-bold text-xl"}>Balaji Premkumar</h1>
                    <button className="p-4" onClick={() => toggleSidebar()}>
                        <FiMenu className="h-6 w-6"/>
                    </button>
                </div>
                <div className={`md:hidden bg-gray-900 text-white ${isOpen ? 'block' : 'hidden'}`}>
                    <SidebarComponent toggleSidebar={toggleSidebar} showHeader={false}/>
                </div>

                <div className="hidden md:block md:w-1/4 h-screen sticky top-0 bg-gray-900 text-white">
                    <SidebarComponent toggleSidebar={false} showHeader={true}/>
                </div>
                <div className="md:w-3/4 h-screen overflow-y-scroll bg-gray-200">
                    <RoutePaths/>
                </div>
            </div>
        </Router>
    );


}

const RoutePaths = () => {
    return (
        <Routes>
            <Route path={"/"} element={<AboutComponent/>}/>
            <Route path="/languages" element={<LanguagesComponent/>}/>
            <Route path="/databases" element={<DatabasesComponent/>}/>
            <Route path="/ui-frameworks" element={<UIComponent/>}/>
            <Route path="/experience" element={<ExperienceComponent/>}/>
            <Route path="/contact" element={<ContactComponent/>}/>
        </Routes>
    );
}

export default App;
