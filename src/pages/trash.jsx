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
import { FaTrash } from "react-icons/fa";

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
  return (
    <div className="trash">
        {/* <FaTrash size={300} /> */}
        {trashedEntries.length === 0 && <p>No notes to be recycled</p>}
      {trashedEntries.map((entry) => (
        <div key={entry.id}>
          <p>{entry.title}</p>
          <button onClick={() => restoreEntry(entry.id)}>Restore</button>
        </div>
      ))}
    </div>
  );
};

export default Trash;
