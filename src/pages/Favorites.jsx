import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "@firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db, useAuth } from "../lib/firebase/auth";
import { stateContext } from "../App";
import Decrypt from "../components/decrypt";
import { Link } from "react-router-dom";
import { FaEye, FaHeart, FaPen } from "react-icons/fa";
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
                    position: "absolute",
                    bottom: "20px",
                    left: "100px",
                  }}
                >
                  {/* <FaBookmark onClick={() => handleFavorite(entry.id)} color={entry.isFavorite === true && 'red'} /> */}
                 
                  <FaHeart onClick={() => handleFavorite(fav.id)} color="red" />
                  <Link
                    to={`/dashboard/${"view"}/${fav.id}`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <FaEye title="views" className="view" />
                  </Link>
                  <Tooltip anchorSelect=".views">View</Tooltip>
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
