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

const Navigation = () => {
  const [activeLink, setActiveLink] = useState("home");
  const { theme, setIsOpen, toggleTheme, isOpen, showProfileHandler } = useContext(stateContext);

  const [confirmPassword, setConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");

  const auth = getAuth()
  const user = auth?.currentUser
  const navigate = useNavigate()
  const currentUser = useAuth();
  console.log(currentUser?.photoURL)

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
    console.log(user, password)
    reauthenticateWithCredential(user, password).then(() => {
      console.log('reauthentication successful')
    }).catch ((error) => {
      console.log('An error occured: ',error)
    })
  }

  const deleteUserAccount = async (password) => {
    try {
      const reauthenticate = await reauthenticateUser(password);
      console.log(reauthenticate)
      if (reauthenticate) {
        console.log('true')
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

            
          <button
            onClick={() => {
              setConfirmPassword(!confirmPassword);
            }}
          >
            Delete Account
          </button>
          {confirmPassword && (
            <div className="reauthenticate">
              <AiFillCloseCircle
                onClick={() => {
                  setConfirmPassword(!confirmPassword);
                }}
              />
              <form onSubmit={deleteUserAccount}>
                <label>Confirm Password</label>
                <div style={{ display: "flex", gap: "20px" }}>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="submit">Done</button>
                </div>
              </form>
              </div>
          )}
           
          </ul>
        </div>
        
      </div>
      <div className="dashboard-main">
        <div className="dashboard-header">
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
              <li onClick={() => {handleOptionSelect(); toggleTheme()} }>
                <span>
                {theme =='dark'? <span><FaSun /> Light mode</span>: <span><FaMoon /> Dark mode</span>}
                </span>
              </li>
              <li onClick={() => {handleOptionSelect(); handleSignOut();}}><FaSignOutAlt />  Logout</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
