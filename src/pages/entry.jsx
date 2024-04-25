import React, { useContext } from "react";
import { stateContext } from "../App";
import Decrypt from "../components/decrypt";
import { Link } from "react-router-dom";
import { db, useAuth } from "../lib/firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from "@firebase/firestore";
import { FaBookmark, FaEye, FaEyeSlash, FaPen, FaRibbon, FaTrash } from "react-icons/fa";
import { Tooltip } from "react-tooltip";

const Entry = () => {
  const { loading, data } = useContext(stateContext);

  const currentUser = useAuth();
  const userId = currentUser?.uid;
  console.log(userId);

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

  const moveEntryToTrash = async (entryId) => {
    //   try {
    //     // Get the entry from the original collection (e.g., 'Entries')
    //     const entryRef = collection(db, 'Entries', entryId);
    //     const entrySnapshot = await entryRef.get();
    //     const entryData = entrySnapshot.data();

    //     // Add the entry to the 'Trash' collection
    //     await db.collection('Trash').add(entryData);

    //     // Delete the entry from the original collection
    //     await entryRef.delete();
    //   } catch (error) {
    //     console.error('Error moving entry to trash:', error);
    //   }
    const confirmDelete = window.confirm("Are you sure you want to move to trash?");
    if (confirmDelete){
    try {
      const docRef = doc(db, "Entries", entryId);
      const docSnap = await getDoc(docRef);


      if (docSnap.exists()) {
        const entryRef = collection(db, 'Trash')
        const entryData = { ...docSnap.data(), id: docSnap.id };
        console.log(entryData)
        await addDoc(entryRef, entryData);
        console.log('okay')
      } else {
        console.log("Document not found");
      }

      await deleteDoc(docRef)
    } catch (err) {
      console.error("Error fetching document:", err);
    }
  }
  };

  const handleFavorite = async(id)=> {
     try{
      const favoriteRef = doc(db, 'Entries', id)
      const favoriteSnap = await getDoc(favoriteRef)

      if (favoriteSnap.exists()) {
        const isFavorite = favoriteSnap.data().isFavorite || false;
        await updateDoc(favoriteRef, {isFavorite: !isFavorite})
      }
     } catch (err) {
      console.log(err)
     }
  }

  const handlePublic = async(id)=> {
    try{
     const publicRef = doc(db, 'Entries', id)
     const publicSnap = await getDoc(publicRef)

     if (publicSnap.exists()) {
       const isPublic = publicSnap.data().isPublic || false;
       await updateDoc(publicRef, {isPublic: !isPublic})
     }
    } catch (err) {
     console.log(err)
    }
 }

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
          <div className="entry-tiles">
            {data.map((entry) => (
              <div className="entry-tile" key={entry.id}>
                <p>{entry.title}</p>
                <Decrypt className = 'decrypt'
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
                    left: "80px",
                  }}
                >
                  <FaBookmark onClick={() => handleFavorite(entry.id)} color={entry.isFavorite === true && 'red'} />
                  <Link
                    to={`${"view"}/${entry.id}`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <FaEye title="view" className="view" />
                  </Link>
                  <Tooltip anchorSelect=".view">View</Tooltip>
                  <Link
                    to={`${"edit"}/${entry.id}`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <FaPen className="edit" />
                  </Link>
                  <Tooltip anchorSelect=".edit">Edit</Tooltip>
                  <FaTrash
                    onClick={() => moveEntryToTrash(entry.id)}
                    className="delete"
                  />
                  <Tooltip anchorSelect=".delete">Move to trash</Tooltip>
                  <FaEyeSlash onClick={() => handlePublic(entry.id)}  />
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
