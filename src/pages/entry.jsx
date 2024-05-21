import React, { useContext, useState } from "react";
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
  FaPen,
  FaRibbon,
  FaTrash,
} from "react-icons/fa";
import { Tooltip } from "react-tooltip";

const Entry = () => {
  const { loading, data, theme } = useContext(stateContext);
  console.log(data.length);
  const [isOpen, setIsOpen] = useState(new Array(data?.length).fill(false));

  const currentUser = useAuth();
  const userId = currentUser?.uid;
  console.log(userId);

 
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

  return (
    <div className="entries">
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
          {/* <div className="entry-tiles">
            {data.map((entry, index) => (
              <div className="entry-tile" key={entry.id}>
                <p>{entry.title.slice(0, 15)}{entry.title.length > 15 && '...'}</p>
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
                    color={entry.isFavorite === true ? "red" :`${theme === 'dark'? 'white' : 'black'}`}
                  />
                  <Tooltip anchorSelect=".favorite">Favorite</Tooltip>
                  <Link
                    to={`${"view"}/${entry.id}`}
                    style={{ textDecoration: "none", color: `${theme === 'dark'? 'white' : 'black'}` }}
                  >
                    <FaEye  className="view" />
                  </Link>
                  <Tooltip anchorSelect=".view">View</Tooltip>
                  <Link
                    to={`${"edit"}/${entry.id}`}
                    style={{ textDecoration: "none", color: `${theme === 'dark'? 'white' : 'black'}`}}
                  >
                    <FaPen className="edit" />
                  </Link>
                  <Tooltip anchorSelect=".edit">Edit</Tooltip>
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
          </div> */}
          <div className="entry-lists">
            {data.map((entry, index) => (
              <div className="entry-list" key={index}>
                <Link
                    to={`${"view"}/${entry.id}`}
                    style={{ textDecoration: "none", color: `${theme === 'dark'? 'white' : 'black'}` }}
                  >
                    <p>{entry.title.slice(0, 15)}{entry.title.length > 15 && '...'}</p>
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
                    color={entry.isFavorite === true ? "red" :`${theme === 'dark'? 'white' : 'black'}`}
                  />
                  <Tooltip anchorSelect=".favorite">Favorite</Tooltip>
                 <span onClick={() => handlePublic(entry.id, index)}>{entry.isPublic ? <FaEye  className="private" /> : <FaEyeSlash className="public" /> }</span> 
                  <Tooltip anchorSelect=".private">Make Private</Tooltip>
                  <Tooltip anchorSelect=".public">Make Public</Tooltip>

                  <Link
                    to={`${"edit"}/${entry.id}`}
                    style={{ textDecoration: "none", color: `${theme === 'dark'? 'white' : 'black'}`}}
                  >
                    <FaPen className="edit" />
                  </Link>
                  <Tooltip anchorSelect=".edit">Edit</Tooltip>
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
        </div>
      )}
    </div>
  );
};

export default Entry;
