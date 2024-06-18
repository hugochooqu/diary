import React, { useContext, useState, useRef } from "react";
import { stateContext } from "../App";
import Decrypt from "../components/decrypt";
import { Link } from "react-router-dom";
import { db, useAuth } from "../lib/firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "@firebase/firestore";
import {
  FaBookmark,
  FaEllipsisV,
  FaEye,
  FaEyeSlash,
  FaHamburger,
  FaHeart,
  FaLock,
  FaLockOpen,
  FaPen,
  FaRibbon,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { AiFillCloseCircle } from "react-icons/ai";
import EntryDetails from "./entryDetails";
import { set } from "@firebase/database";
import SearchQuery from "../components/SearchQuery";

const Entry = () => {
  const {
    loading,
    data,
    theme,
    grid,
    read,
    setRead,
    activeIndex,
    handleTileClick,
    edit,
    setEdit,
    searchTerm,
    handleClearSearch,
    handleSearchChange,
  } = useContext(stateContext);
  console.log(data.length);
  const [isOpen, setIsOpen] = useState(new Array(data?.length).fill(false));
  const [entryId, setEntryId] = useState("");
  // const [searchTerm, setSearchTerm] = useState("");

  const currentUser = useAuth();
  const userId = currentUser?.uid;
  console.log(userId);

  const searchInputRef = useRef(null);

  // const handleSearchChange = (event) => {
  //   setSearchTerm(event.target.value);
  // };

  // const handleClearSearch = () => {
  //   if (searchInputRef.current) {
  //     searchInputRef.current.value = "";
  //     setSearchTerm("");
  //     console.log("Search Input Cleared");
  //   }
  // };

  const moveEntryToTrash = async (entryId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to move to trash?"
    );
    if (confirmDelete) {
      try {
        const docRef = doc(db, "Entries", entryId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const entryRef = collection(db, "Trash");
          const entryData = { ...docSnap.data(), id: docSnap.id };
          console.log(entryData);
          await addDoc(entryRef, entryData);
          console.log("okay");
          setRead(false);
          setEdit(false);
        } else {
          console.log("Document not found");
        }

        await deleteDoc(docRef);
      } catch (err) {
        console.error("Error fetching document:", err);
      }
    }
  };

  const handleFavorite = async (id) => {
    try {
      const favoriteRef = doc(db, "Entries", id);
      const favoriteSnap = await getDoc(favoriteRef);

      if (favoriteSnap.exists()) {
        const isFavorite = favoriteSnap.data().isFavorite || false;
        await updateDoc(favoriteRef, { isFavorite: !isFavorite });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePublic = async (id, index) => {
    try {
      const publicRef = doc(db, "Entries", id);
      const publicSnap = await getDoc(publicRef);

      if (publicSnap.exists()) {
        const isPublic = publicSnap.data().isPublic || false;
        await updateDoc(publicRef, { isPublic: !isPublic });
      }
    } catch (err) {
      console.log(err);
    }

    setIsOpen((prevIsOpen) => {
      const updatedIsOpen = new Array(prevIsOpen.length).fill(false); // Create a copy of the state array
      updatedIsOpen[index] = false; // Toggle the dropdown state for the specified index
      return updatedIsOpen; // Return the updated array
    });
  };

  const toggleDropdown = (index) => {
    setIsOpen((prevIsOpen) => {
      const updatedIsOpen = new Array(prevIsOpen.length).fill(false); // Create a copy of the state array
      updatedIsOpen[index] = !updatedIsOpen[index]; // Toggle the dropdown state for the specified index
      return updatedIsOpen; // Return the updated array
    });
  };

  const handleOptionSelect = () => {
    setIsOpen(false);
  };

  console.log(searchTerm);

  return (
    <div className="entries">
      <SearchQuery />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="dashboard-main-main" style={{ margin: "auto" }}>
          {data.length === 0 && (
            <p style={{ margin: "auto", width: "40%" }}>
              Oops! No entry here.{" "}
              <Link to="/dashboard" style={{ textDecoration: "none" }}>
                Write now
              </Link>
            </p>
          )}
          {}
          {/*  */}
          {grid ? (
            <div className={`${read || edit ? "changeGrid" : "entry-tiles"}`}>
              {data.map((entry, index) => (
                <div
                  className="entry-tile"
                  key={entry.id}
                  style={{
                    backgroundColor:
                      activeIndex === index
                        ? "rgb(136, 136, 136)"
                        : "rgb(35, 202, 202)",
                  }}
                >
                  {/* <Link
                    to={`${"view"}/${entry.id}`}
                    style={{
                      
                      textDecoration: "none",
                      color: `${theme === "dark" ? "white" : "black"}`, 
                    }}
                  > */}
                  <p className="entry-title">
                    {entry.title.slice(0, 15)}
                    {entry.title.length > 15 && "..."}
                  </p>
                  {/* </Link> */}
                  <Decrypt
                    className="decrypt"
                    encryptedData={entry.encryptedData}
                    decryptKey={entry.key}
                    iv={entry.iv}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "20px",
                      position: "relative",
                      bottom: "-10px",
                      left: "50px",
                    }}
                  >
                    <FaHeart
                      className="favorite"
                      onClick={() => handleFavorite(entry.id)}
                      color={
                        entry.isFavorite === true
                          ? "red"
                          : `${theme === "dark" ? "white" : "black"}`
                      }
                    />
                    <Tooltip anchorSelect=".favorite">Favorite</Tooltip>

                    <FaEye
                      onClick={() => {
                        setRead(true);
                        handleTileClick(index);
                        setEntryId(entry.id);
                        setEdit(false);
                      }}
                      className="views"
                    />
                    <Tooltip anchorSelect=".views">View</Tooltip>

                    {/* <Link
                      to={`${"edit"}/${entry.id}`}
                      style={{
                        textDecoration: "none",
                        color: `${theme === "dark" ? "white" : "black"}`,
                      }}
                    > */}
                    <FaPen
                      className="edit"
                      onClick={() => {
                        setEdit(true);
                        setRead(false);
                        handleTileClick(index);
                        setEntryId(entry.id);
                      }}
                    />
                    {/* </Link> */}
                    <Tooltip anchorSelect=".edit">Edit</Tooltip>
                    <FaTrash
                      onClick={() => moveEntryToTrash(entry.id)}
                      className="delete"
                    />
                    <Tooltip anchorSelect=".delete">Move to trash</Tooltip>
                    {/* <FaEllipsisV onClick={() => toggleDropdown(index)} />
                    {isOpen[index] && (
                      <ul className={`toggle-menu ${theme}`}>
                        <li onClick={() => handlePublic(entry.id, index)}>
                          {entry.isPublic ? "Make Private" : "Make Public"}
                        </li>
                      </ul>
                    )} */}
                    <span onClick={() => handlePublic(entry.id, index)}>
                      {entry.isPublic ? (
                        <FaLockOpen className="private" />
                      ) : (
                        <FaLock className="public" />
                      )}
                    </span>
                    <Tooltip anchorSelect=".private">Make Private</Tooltip>
                    <Tooltip anchorSelect=".public">Make Public</Tooltip>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="entry-lists">
              {data.map((entry, index) => (
                <div className="entry-list" key={index}>
                  <Link
                    to={`${"view"}/${entry.id}`}
                    style={{
                      width: "40px",
                      textDecoration: "none",
                      color: `${theme === "dark" ? "white" : "black"}`,
                    }}
                  >
                    <p>
                      {entry.title.slice(0, 15)}
                      {entry.title.length > 15 && "..."}
                    </p>
                  </Link>

                  <Decrypt
                    className="decrypt"
                    encryptedData={entry.encryptedData}
                    decryptKey={entry.key}
                    iv={entry.iv}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "20px",
                      position: "relative",
                      top: "-25px",
                      left: "800px",
                    }}
                  >
                    <FaHeart
                      className="favorite"
                      onClick={() => handleFavorite(entry.id)}
                      color={
                        entry.isFavorite === true
                          ? "red"
                          : `${theme === "dark" ? "white" : "black"}`
                      }
                    />
                    <Tooltip anchorSelect=".favorite">Favorite</Tooltip>
                    <span onClick={() => handlePublic(entry.id, index)}>
                      {entry.isPublic ? (
                        <FaEye className="private" />
                      ) : (
                        <FaEyeSlash className="public" />
                      )}
                    </span>
                    <Tooltip anchorSelect=".private">Make Private</Tooltip>
                    <Tooltip anchorSelect=".public">Make Public</Tooltip>

                    <Link
                      to={`${"edit"}/${entry.id}`}
                      style={{
                        textDecoration: "none",
                        color: `${theme === "dark" ? "white" : "black"}`,
                      }}
                    >
                      <FaPen className="edit" />
                    </Link>
                    <Tooltip anchorSelect=".edit">Edit Entry</Tooltip>
                    <FaTrash
                      onClick={() => moveEntryToTrash(entry.id)}
                      className="delete"
                    />
                    <Tooltip anchorSelect=".delete">Move to trash</Tooltip>
                    <FaEllipsisV onClick={() => toggleDropdown(index)} />
                    {isOpen[index] && (
                      <ul className={`toggle-menu ${theme}`}>
                        <li onClick={() => handlePublic(entry.id, index)}>
                          {entry.isPublic ? "Make Private" : "Make Public"}
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {edit || read ? (
            <div className="view">
              <AiFillCloseCircle
                onClick={() => {
                  setRead(false);
                  handleTileClick(null);
                  setEdit(false);
                }}
                style={{ padding: "20px 10px" }}
              />
              <EntryDetails index={entryId} />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Entry;
