import React, { useEffect, useState } from "react";
import AddEntryForm from "../components/AddEntryForm";

const Dashboard = () => {
  const [theme, setTheme] = useState("light");
  const [activeLink, setActiveLink] = useState('')
  const [userName, setUserName] = useState(null)
  const [userId, setUserId] = useState(null)

 
  

  useEffect(() => {
    const urlSearchString = window.location.search;
    const params = new URLSearchParams(urlSearchString)

    setUserName(params.get('email'))
    setUserId(params.get('id'))
    console.log(userName)
  })
  

  const handleLinkClink = (link) => {
    setActiveLink(link)
  } 

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className={`dashboard ${theme}`}>
      <div className="dashboard-sidebar">
        <p className="dashboard-logo">write</p>
        <div className="sidebar-menu">
          <ul >
            <li className={activeLink === 'home' ? 'active' : 'inactive'} onClick={() => handleLinkClink('home')}>Home</li>
            <li className={activeLink === 'notes' ? 'active' : 'inactive'} onClick={() => handleLinkClink('notes')}>Notes</li>
            <li className={activeLink === 'settings' ? 'active' : 'inactive'} onClick={() => handleLinkClink('settings')}>Settings</li>
            <li className={activeLink === 'logout' ? 'active' : 'inactive'} onClick={() => handleLinkClink('logout')}>Logout</li>
          </ul>
        </div>
      </div>
      {userName? <p>{userName}</p> : <i>undefined</i>}
      <span>
        Dark mode <input type="checkbox" onClick={toggleTheme} />
      </span>
      {activeLink === 'notes'? <AddEntryForm userId={userId}/> : null}
    </div>
  );
};

export default Dashboard;
