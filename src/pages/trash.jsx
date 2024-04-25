import React, { useState, useEffect, useContext } from "react";
import { db, useAuth } from "../lib/firebase/auth";
import { stateContext } from "../App";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
} from "@firebase/firestore";
import { get } from "@firebase/database";
import { FaTrash, FaUndo } from "react-icons/fa";
import Decrypt from "../components/decrypt";

const Trash = () => {
  const [trashedEntries, setTrashedEntries] = useState([]);

  const { setLoading } = useContext(stateContext);
  const currentUser = useAuth();

  useEffect(() => {
    setLoading(true);
    const fetchTrashedEntries = onSnapshot(
      collection(db, "Trash"),
      (snapshot) => {
        try {
          const newData = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          const filteredTrashData = newData.filter(
            (data) => data.userId === currentUser?.uid
          );

          setTrashedEntries(filteredTrashData);
          setLoading(false);
        } catch (error) {
          console(error);
          setLoading(false);
        }
      }
    );
    return () => fetchTrashedEntries();
  }, [currentUser]);

  console.log(trashedEntries);

  const restoreEntry = async (entryId) => {
    try {
      const entryRef = doc(db, "Trash", entryId);
      const entrySnapshot = await getDoc(entryRef);
      // const entryData = entrySnapshot.data();

      if (entrySnapshot.exists()) {
        const restoreRef = collection(db, "Entries");
        const entry = { ...entrySnapshot.data(), id: entrySnapshot.id };
        await addDoc(restoreRef, entry);
      } else {
        console.log("Document not found");
      }

      await deleteDoc(entryRef);
      // await deleteDoc(doc(db, "Entries", id));

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeletePermanenetly = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete permanently?");
    console.log(id);
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "Trash", id));
        // window.location.reload()
      } catch (error) {
        console.log("an error occured", error);
      }
    }
  };
  return (
    <div className="trash">
      {/* <FaTrash size={300} /> */}
      {trashedEntries.length === 0 && <p>No notes to be recycled</p>}
      <div className="trash-tiles">
        {trashedEntries.map((entry) => (
          <div className="trash-tile" key={entry.id}>
            <div>
              <h3>{entry.title}</h3>
              <Decrypt
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
                  left: "70px",
                }}
              >
                <FaUndo onClick={() => restoreEntry(entry.id)} />
                <FaTrash onClick={() => handleDeletePermanenetly(entry.id)}/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trash;
