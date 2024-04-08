import React, { useState } from "react";
import { db } from "../lib/firebase/auth";
import { getDatabase, ref, set } from "@firebase/database";
import { addDoc, collection , serverTimestamp } from "@firebase/firestore";

const AddEntryForm = (userId) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

//   const db = getDatabase()
//   console.log(db)

  console.log(userId);
  const uid = userId;

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
        if (!db) {
            throw new Error("Firestore instance 'db' is not initialized.");
          }

      const collectionRef = collection(db, "Entries");
      const entryData = {
        title,
        content,
        time: serverTimestamp(),
        uid,
      };
      await addDoc(collectionRef, entryData);
      console.log('okay')
    } catch (err) {
      console.log(err);
    }
    // console.log(uid)
    // const newEntryRef = ref(db, '/entries/').push();
    // newEntryRef.set(entryData)

    setTitle("");
    setContent("");
    console.log(title);
    console.log(content);

    // const db = getDatabase();
    // set(ref(db, '/entries'), {
    //     title: title,
    //     body: content
    // })
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "title") setTitle(value);
    if (name === "content") setContent(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={handleChange}
        placeholder="Title"
        name="title"
      />
      <textarea
        value={content}
        onChange={handleChange}
        name="content"
      ></textarea>
      <button type="submit">Submit</button>
    </form>
  );
};

export default AddEntryForm;
