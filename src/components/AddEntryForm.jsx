import React, { useState } from "react";
import forge from 'node-forge'
import { db, useAuth } from "../lib/firebase/auth";
import { getDatabase, ref, set } from "@firebase/database";
import { addDoc, collection , serverTimestamp } from "@firebase/firestore";

const AddEntryForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const currentUser = useAuth();
  const userId = currentUser?.uid;
  console.log(userId)

  const key = forge.random.getBytesSync(32)
  const iv = forge.random.getBytesSync(16)
  const cipher = forge.cipher.createCipher('AES-CBC', key);
  cipher.start({iv})
  cipher.update(forge.util.createBuffer(content, 'utf8'))
  cipher.finish();
  const encryptedData = cipher.output.getBytes()

    // const subtleCrypto = window.crypto.subtle;
    // const key = await subtleCrypto.generateKey(
    //     {name: 'AES-GCM', length: 256},
    //     true,
    //     ['encrypt', 'decrypt']
    // );
    // const encryptedData = await subtleCrypto.encrypt(
    //     {name: 'AES-GCM'},
    //     key,
    //     'Hello World'
    // )

    // console.log(encryptedData)

  //   const db = getDatabase()
//   console.log(db)

  console.log(userId);

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
        if (!db) {
            throw new Error("Firestore instance 'db' is not initialized.");
          }

      const collectionRef = collection(db, "Entries");
      const entryData = {
        title,
        encryptedData,
        time: serverTimestamp(),
        userId
        
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
    <div className="add-entry">
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
        placeholder="Content"
      ></textarea>
      <button type="submit">Submit</button>
    </form>
    </div>
  );
};

export default AddEntryForm;
