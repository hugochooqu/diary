import React, { useEffect, useState, useContext } from "react";
import { stateContext } from "../App";
import AddEntryForm from "../components/AddEntryForm";
// import { collection, query, where, getDocs } from "@firebase/firestore";
import { db, useAuth } from "../lib/firebase/auth";
import forge from "node-forge";
import Decrypt from "../components/decrypt";
import { Link } from "react-router-dom";
import {
  deleteDoc,
  doc,
  orderBy,
  query,
  collection,
  limit,
  getDocs,
} from "@firebase/firestore";

const Dashboard = () => {
  const [theme, setTheme] = useState("light");
  const [activeLink, setActiveLink] = useState("notes");
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [recentEntries, setRecentEntries] = useState("");
  const [encrypted, setEncrypted] = useState("");

  const { data, loading } = useContext(stateContext);
  console.log(data);

  useEffect(() => {
    const urlSearchString = window.location.search;
    const params = new URLSearchParams(urlSearchString);

    setUserName(params.get("email"));
    setUserId(params.get("id"));
    console.log(userName);
    console.log(userId);
  });

  const handleLinkClink = (link) => {
    setActiveLink(link);
  };

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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    console.log(id);
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "Entries", id));
        // window.location.reload()
      } catch (error) {
        console.log("an error occured", error);
      }
    }
  };

  useEffect(() => {
    const getRecentEntries = async () => {
      try {
        const q = query(
          collection(db, "Entries"),
          orderBy("currentDateString", "desc"),
          limit(3)
        );

        const docSnap = await getDocs(q);
        const recentEntries = [];

        docSnap.forEach((doc) => {
          recentEntries.push({ id: doc.id, ...doc.data() });
        });

        if (recentEntries.length > 0) {
          setRecentEntries(recentEntries);
        } else {
          console.log("No recent entries found!");
        }
      } catch (error) {
        console.error("Error getting recent entries:", error);
      }
    };

    getRecentEntries();
  }, []);
  console.log(recentEntries);

  return (
    <div className={`dashboard ${theme}`}>
      <div className="dashboard-sidebar">
        <p style={{ padding: "30px" }}>Hello, {userName}</p>
        {/* <p className="dashboard-logo">write</p> */}
        <div className="sidebar-menu">
          <ul>
            <li
              className={activeLink === "notes" ? "active" : "inactive"}
              onClick={() => handleLinkClink("notes")}
            >
              Add Notes
            </li>
            <Link to='/entries' style={{textDecoration:'none', color:'black'}}>
              <li
                className={activeLink === "home" ? "active" : "inactive"}
                onClick={() => handleLinkClink("home")}
              >
                View all entries
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

          {recentEntries && recentEntries.length > 0 ? (
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
          )}
        </div>
      </div>
      <div className="dashboard-main">
        <div className="dashboard-header">
          {/* {userName ? <p>{userName}</p> : <i>undefined</i>}
          <span>
            Dark mode <input type="checkbox" onClick={toggleTheme} />
          </span> */}
          <h1>DEE YA</h1>
        </div>

        {loading ? <p>Loading...</p> : <AddEntryForm />}
      </div>
    </div>
  );
};

export default Dashboard;
