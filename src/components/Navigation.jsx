import React, { useContext, useEffect, useState } from "react";
import { stateContext } from "../App";
import { useAuth } from "../lib/firebase/auth";
import { FaBars, FaCog, FaHeart, FaHome, FaLightbulb, FaTrash } from "react-icons/fa";
import { Link, Outlet } from "react-router-dom";

const Navigation = () => {
  const [activeLink, setActiveLink] = useState("home");
  const {theme, setIsOpen, toggleTheme, isOpen} = useContext(stateContext)

  const currentUser = useAuth();

  const handleLinkClink = (link) => {
    setActiveLink(link);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleOptionSelect = () => {
    setIsOpen(false);
  };

  return (
    <div className={`dashboard ${theme}`}>
      <div className="dashboard-sidebar">
        <p style={{ padding: "30px" }}>
          Hello, {currentUser?.displayName || "user"}
        </p>
        <div className="sidebar-menu">
          <ul>
            <Link
              to="/dashboard"
              style={{
                textDecoration: "none",
                color: theme === "light" ? "black" : "white",
              }}
            >
              <li
                className={activeLink === "home" ? "active" : "inactive"}
                onClick={() => handleLinkClink("home")}
              >
                <FaHome /> Home
              </li>
            </Link>
            <Link
              to="new"
              style={{
                textDecoration: "none",
                color: theme === "light" ? "black" : "white",
              }}
            >
              <li
                className={activeLink === "notes" ? "active" : "inactive"}
                onClick={() => handleLinkClink("notes")}
              >
                <FaLightbulb /> Add Notes
              </li>
            </Link>
            <Link
              to="favorites"
              style={{
                textDecoration: "none",
                color: theme === "light" ? "black" : "white",
              }}
            >
              <li
                className={activeLink === "favorite" ? "active" : "inactive"}
                onClick={() => handleLinkClink("favorite")}
              >
                <FaHeart /> Favorites
              </li>
            </Link>
            <Link
              to="trash"
              style={{
                textDecoration: "none",
                color: theme === "light" ? "black" : "white",
              }}
            >
              <li
                className={activeLink === "trash" ? "active" : "inactive"}
                onClick={() => handleLinkClink("trash")}
              >
                <FaTrash /> Trash
              </li>
            </Link>
            <Link to="public-diaries"
              style={{
                textDecoration: "none",
                color: theme === "light" ? "black" : "white",
              }}>
            <li className={activeLink === "public" ? "active" : "inactive"}
                onClick={() => handleLinkClink("public")}>
              <FaBars />  Public Diaries
            </li>
            </Link>

            {/* <li
              className={activeLink === "settings" ? "active" : "inactive"}
              onClick={() => handleLinkClink("settings")}
            >
              Settings
            </li>
            <li
              className={activeLink === "logout" ? "active" : "inactive"}
              onClick={() => handleLinkClink("logout")}
            >
              Logout
            </li> */}
          </ul>
        </div>
        <div className="recent-entries">
          <h2>Recent Entries</h2>

          {/* {recentEntries && recentEntries.length > 0 ? (
            recentEntries.map((entry) => (
              <div>
                <Link
                  to={`/entry/${"view"}/${entry.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <p>{entry.title.slice(0, 20)}...</p>
                </Link>
              </div>
            ))
          ) : (
            <li>No recent entries found</li>
          )} */}
        </div>
      </div>
      <div className="dashboard-main">
        <div className="dashboard-header">
          {/* {userName ? <p>{userName}</p> : <i>undefined</i>}
           */}
          <h1>DEE YA</h1>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <FaCog
              style={{ padding: "20px 0px", cursor: "pointer" }}
              size={25}
              onClick={toggleDropdown}
            />
            <img src={currentUser?.photoURL} alt="pics" className="photo" />
          </div>
          {isOpen && (
            <ul className={`dropdown-menu ${theme}`}>
              <li onClick={handleOptionSelect}>
                <span>
                  Dark mode <input type="checkbox" onClick={toggleTheme} />
                </span>
              </li>
              <li>Logout</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
