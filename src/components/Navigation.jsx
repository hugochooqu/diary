import React, { useContext, useEffect, useState } from "react";
import { stateContext } from "../App";
import { SignOut, useAuth } from "../lib/firebase/auth";
import {
  FaArrowCircleLeft,
  FaBars,
  FaBell,
  FaCog,
  FaHeart,
  FaHome,
  FaLightbulb,
  FaList,
  FaMoon,
  FaSignOutAlt,
  FaSun,
  FaTrash,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { getAuth, reauthenticateWithCredential, signOut } from "@firebase/auth";
import { AiFillCloseCircle } from "react-icons/ai";
import { FaGrip } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";
import { set } from "@firebase/database";

const Navigation = () => {
  const [activeLink, setActiveLink] = useState("home");
  const {
    theme,
    setIsOpen,
    toggleTheme,
    isOpen,
    showProfileHandler,
    setGrid,
    grid,
    setRead,
    handleTileClick,
    setEdit,
    formattedDate
  } = useContext(stateContext);

  const [confirmPassword, setConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");

  const auth = getAuth();
  const user = auth?.currentUser;
  const navigate = useNavigate();
  const currentUser = useAuth();
  console.log(currentUser?.photoURL);

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
    } else if (location.includes("reminders")) {
      setActiveLink("reminders");
    }

    // setUserId(params.get("id"));
  });

  // const handleSignOut = () => {
  //   SignOut()
  //     .then(() => {
  //       navigate('/signin');
  //     })
  //     .catch((error) => {
  //       console.error('Error signing out:', error);
  //       // Handle error if necessary
  //     });
  // };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("successful");
        navigate("/signin");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const reauthenticateUser = async (password) => {
    console.log(user, password);
    reauthenticateWithCredential(user, password)
      .then(() => {
        console.log("reauthentication successful");
      })
      .catch((error) => {
        console.log("An error occured: ", error);
      });
  };

  const deleteUserAccount = async (password) => {
    try {
      const reauthenticate = await reauthenticateUser(password);
      console.log(reauthenticate);
      if (reauthenticate) {
        console.log("true");
        // await deleteUser(user);
        // console.log("User account deleted successfully");
      } else {
        console.log("Failed to re-authenticate user");
      }
    } catch (error) {
      console.error("Error deleting user account: ", error);
    }
    // if (confirmDelete) {
    //   deleteUser(user)
    //     .then(() => {
    //       // User deleted
    //       console.log("successful");
    //       redirect("/signin");
    //     })
    //     .catch((error) => {
    //       window.alert("an error occured");
    //       console.log(error);
    //     });
    // }
  };

  console.log(confirmPassword);

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
                onClick={() => {
                  handleLinkClink("home");
                  setRead(false);
                  setEdit(false);
                  handleTileClick(null);
                }}
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
                onClick={() => {
                  handleLinkClink("notes");
                  setRead(false);
                  setEdit(false);
                  handleTileClick(null);
                }}
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
                onClick={() => {
                  handleLinkClink("favorite");
                  setRead(false);
                  setEdit(false);
                  handleTileClick(null);
                }}
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
                onClick={() => {
                  handleLinkClink("reminders");
                  setRead(false);
                  setEdit(false);
                  handleTileClick(null);
                }}
              >
                <FaBell color={activeLink === "reminders" ? "gold" : null} />{" "}
                Reminders
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
                onClick={() => {
                  handleLinkClink("trash");
                  setRead(false);
                  setEdit(false);
                  handleTileClick(null);
                }}
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
                onClick={() => {
                  handleLinkClink("public");
                  setRead(false);
                  setEdit(false);
                  handleTileClick(null);
                }}
              >
                <FaBars /> Public Diaries
              </li>
            </Link>
            <Link
              to="/community"
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
          </ul>
        </div>
      </div>
      <div className="dashboard-main">
        <div className="dashboard-header">
          <p>{formattedDate}</p>
          <h1>DEE YA</h1>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <span
              className="grid"
              onClick={() => {
                setGrid(!grid);
                setRead(false);
                handleTileClick(null);
              }}
            >
              {grid ? (
                <FaList className="list" size={20} />
              ) : (
                <FaGrip className="grids" size={20} />
              )}
              <Tooltip anchorSelect=".grids">Grid view</Tooltip>
              <Tooltip anchorSelect=".list">List view</Tooltip>
            </span>
            <FaCog
              style={{ padding: "20px 0px", cursor: "pointer" }}
              size={25}
              onClick={toggleDropdown}
            />
            <img src={currentUser?.photoURL} alt="pics" className="photo" />
          </div>
          {isOpen && (
            <ul className={`dropdown-menu ${theme}`}>
              <li
                onClick={() => {
                  showProfileHandler();
                  handleOptionSelect();
                }}
              >
                <FaUser /> View profile
              </li>
              <li
                onClick={() => {
                  handleOptionSelect();
                  toggleTheme();
                }}
              >
                <span>
                  {theme == "dark" ? (
                    <span>
                      <FaSun /> Light mode
                    </span>
                  ) : (
                    <span>
                      <FaMoon /> Dark mode
                    </span>
                  )}
                </span>
              </li>
              <li
                onClick={() => {
                  handleOptionSelect();
                  handleSignOut();
                }}
              >
                <FaSignOutAlt /> Logout
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
