import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "@firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db, useAuth } from "../lib/firebase/auth";
import { stateContext } from "../App";
import Decrypt from "../components/decrypt";
import { Link } from "react-router-dom";
import { FaEye, FaPen } from "react-icons/fa";
import {Tooltip} from 'react-tooltip'

const Favorites = () => {
  const [favoriteEntries, setFavoriteEntries] = useState([]);
  const currentUser = useAuth();
  const { setLoading, loading } = useContext(stateContext);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, "Entries"), (snapshot) => {
      try {
        const newData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        const filteredData = newData.filter(
          (data) => data.userId === currentUser?.uid && data.isFavorite === true
        );

        setFavoriteEntries(filteredData);
        setLoading(false);
      } catch (error) {
        console(error);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [currentUser]);


  return (
    <div className="trash">
      {favoriteEntries.length === 0 && <p>No Favorite Entry here</p>}
      <div className="trash-tiles">
      {favoriteEntries.map((fav) => (
        <div className="trash-tile" key={fav.id}>
          <h3>{fav.title}</h3>
          <Decrypt
            encryptedData={fav.encryptedData}
            decryptKey={fav.key}
            iv={fav.iv}
          />
          <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "20px",
                    position: "relative",
                    bottom: "-10px",
                    left: "80px",
                  }}
                >
                  {/* <FaBookmark onClick={() => handleFavorite(entry.id)} color={entry.isFavorite === true && 'red'} /> */}
                  <Link
                    to={`/dashboard/${"view"}/${fav.id}`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <FaEye title="view" className="view" />
                  </Link>
                  <Tooltip anchorSelect=".view">View</Tooltip>
                  <Link
                    to={`/dashboard/${"edit"}/${fav.id}`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <FaPen className="edit" />
                  </Link>
                  <Tooltip anchorSelect=".edit">Edit</Tooltip>
                  {/* <FaTrash
                    onClick={() => moveEntryToTrash(fav.id)}
                    className="delete"
                  />
                  <Tooltip anchorSelect=".delete">Move to trash</Tooltip> */}
                </div>
        </div>
      ))}</div>
    </div>
  );
};

export default Favorites;
