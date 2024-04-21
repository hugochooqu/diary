import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "@firebase/firestore";
import React, { useEffect, useState, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import { db } from "../lib/firebase/auth";
import { stateContext } from "../App";
import Decrypt from "../components/decrypt";
import forge from "node-forge";
import Crypto from "crypto-js";

const EntryDetails = () => {
  const { crud, id } = useParams();
  const [entryData, setEntryData] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
  });
  const { setLoading, loading } = useContext(stateContext);

  const location = useLocation();
  const url = window.location.origin + location.pathname;

  useEffect(() => {
    setLoading(true);

    const fetchDocument = async () => {
      try {
        const docRef = doc(db, "Entries", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const entry = { ...docSnap.data(), id: docSnap.id };
          setEntryData(entry);
          setFormData({ title: entry.title, image: entry.imageURL });
        } else {
          console.log("Document not found");
        }
      } catch (err) {
        console.error("Error fetching document:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, []);

  console.log(formData.image);

  console.log(entryData);
  if (entryData !== null && entryData.key !== undefined) {
    var title = entryData.title;
    var encryptedData = entryData.encryptedData;
    var key = entryData.key;
    var iv = entryData?.iv;
    var image = entryData.imageURL;
    // Perform decryption here
    const decipher = forge.cipher.createDecipher("AES-CBC", key);
    decipher.start({ iv: iv });
    decipher.update(forge.util.createBuffer(encryptedData));
    decipher.finish();
    var decryptedData = decipher.output.toString("utf8");
  } else {
    // Key is not available yet, so wait until it becomes available
    console.log("Key is not available yet. Waiting...");
  }

  if (entryData !== null && entryData.key !== undefined) {
    // Perform decryption here
    const cipher = forge.cipher.createCipher("AES-CBC", key);
    cipher.start({ iv });
    cipher.update(forge.util.createBuffer(formData.content, "utf8"));
    cipher.finish();
    var encryptedEditData = cipher.output.getBytes();
  } else {
    // Key is not available yet, so wait until it becomes available
    console.log("Key is not available yet. Waiting...");
  }

  useEffect(() => {
    if (decryptedData) {
      setFormData({ content: decryptedData });
    }
  }, [decryptedData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "Entries", id);
      await updateDoc(docRef, {
        title: formData.title,
        encryptedData: encryptedEditData,
        iv,
        key,
      });
      window.location.reload();
      console.log("Document successfully updated!");
      // Optionally, redirect the user to another page after successful update
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const shareOnFacebook = () => {
    window.FB.ui(
      {
        method: "share",
        href: url,
        quote: formData.title,
      },
      (response) => console.log(response)
    );
  };
  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "white" }}>
      {crud === "view" ? (
        <div className="entry-detail">
          {loading ? <p>Loading...</p> : <h1>{title}</h1>}
          <div style={{display: 'flex', alignItems: 'center', justifyContent:'center'}}>
            <img src={image} alt="ima" />
          </div>
          <p>{decryptedData}</p>
        </div>
      ) : null}
      {crud === "edit" ? (
        <div className="add-entry">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, title: e.target.value }));
              }}
              placeholder="Title"
              name="title"
            />
            <textarea
              value={formData.content}
              name="content"
              placeholder="Content"
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, content: e.target.value }));
              }}
            ></textarea>
            <button type="submit">Submit</button>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default EntryDetails;
