import React, { useContext, useEffect, useState } from "react";
import { stateContext } from "../App";
import { useAuth } from "../lib/firebase/auth";
import {
  FaArrowCircleLeft,
  FaBars,
  FaBell,
  FaCog,
  FaHeart,
  FaHome,
  FaLightbulb,
  FaMoon,
  FaSignOutAlt,
  FaTrash,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { Link, Outlet } from "react-router-dom";

const Navigation = () => {
  const [activeLink, setActiveLink] = useState("home");
  const { theme, setIsOpen, toggleTheme, isOpen, showProfileHandler } = useContext(stateContext);

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
  useEffect(() => {
    const location = window.location.pathname;
    console.log(location);

    if (location.includes("new")) {
      setActiveLink("notes");
    } else if (location.includes("favorites")) {
      setActiveLink("favorite");
    } else if (location.includes("trash")) {
      setActiveLink("trash");
    } else if (location.includes("public")) {
      setActiveLink("public");
    } else if (location.includes('reminders')) {
      setActiveLink('reminders')
    }

    // setUserId(params.get("id"));
  });

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
                <FaHome color={activeLink === "home" ? "purple" : null} /> Home
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
                <FaLightbulb color={activeLink === "notes" ? "yellow" : null} />{" "}
                Add Notes
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
                <FaHeart color={activeLink === "favorite" ? "red" : null} />{" "}
                Favorites
              </li>
            </Link>
            <Link
              to="reminders"
              style={{
                textDecoration: "none",
                color: theme === "light" ? "black" : "white",
              }}
            >
              <li
                className={activeLink === "reminders" ? "active" : "inactive"}
                onClick={() => handleLinkClink("reminders")}
              >
                <FaBell color={activeLink === "reminders" ? "gold" : null} /> Reminders
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
                <FaTrash color={activeLink === "trash" ? "grey" : null} /> Trash
              </li>
            </Link>
            <Link
              to="public-diaries"
              style={{
                textDecoration: "none",
                color: theme === "light" ? "black" : "white",
              }}
            >
              <li
                className={activeLink === "public" ? "active" : "inactive"}
                onClick={() => handleLinkClink("public")}
              >
                <FaBars /> Public Diaries
              </li>
            </Link>
            <Link
              to="xcommunity"
              style={{
                textDecoration: "none",
                color: theme === "light" ? "black" : "white",
              }}
            >
              <li
                className={activeLink === "community" ? "active" : "inactive"}
                onClick={() => handleLinkClink("community")}
              >
                <FaUsers /> Community
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
              <li onClick={() => {showProfileHandler(); handleOptionSelect();}}><FaUser />  View profile</li>
              <li onClick={handleOptionSelect}>
                <span>
                <FaMoon />  Dark mode <input type="checkbox" onClick={toggleTheme} />
                </span>
              </li>
              <li><FaSignOutAlt />  Logout</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
