import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "@firebase/firestore";
import React, { useEffect, useState, useContext } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { db } from "../lib/firebase/auth";
import { stateContext } from "../App";
import Decrypt from "../components/decrypt";
import forge from "node-forge";
import Crypto from "crypto-js";
import { FaArrowLeft, FaPen } from "react-icons/fa";
import TextToSpeech from "../components/TextToSpeech";

const EntryDetails = (props) => {
  const { crud, id } = useParams();
  const [entryData, setEntryData] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
  });
  const { setLoading, loading, read , edit } = useContext(stateContext);
  var entryId = props.index;
  console.log(entryId);
  const history = useNavigate();

  const Back = () => {
    history(-1);
  };

  const location = useLocation();
  const url = window.location.origin + location.pathname;

  useEffect(() => {
    const fetchDocument = async (entryId) => {
      if (!entryId) return;
      console.log(entryId);
      // setLoading(true);

      try {
        const docRef = doc(db, "Entries", entryId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const entry = { ...docSnap.data(), id: docSnap.id };
          setEntryData(entry);
          setFormData({ title: entry.title, image: entry?.imageURL });
        } else {
          console.log("Document not found");
        }
      } catch (err) {
        console.error("Error fetching document:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument(entryId);
  }, [entryId]);

  console.log(formData.image);

  console.log(entryData);
  if (entryData !== null && entryData.key !== undefined) {
    var title = entryData.title;
    var encryptedData = entryData.encryptedData;
    var key = entryData.key;
    var iv = entryData?.iv;
    var image = entryData?.imageURL;
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

  console.log(image);
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
      const docRef = doc(db, "Entries", entryId);
      await updateDoc(docRef, {
        title: formData.title || title,
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

  // style={{height: '420px', width: '520px', borderRadius: "10px"}}
  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {read && ( 
      <div className="entry-detail">
        {/* <p onClick={Back} style={{ cursor: "pointer" }}>
          <FaArrowLeft /> Back
        </p> */}
        <TextToSpeech entry={decryptedData} />
        {loading ? <p>Loading...</p> : <h1>{title}</h1>}
        {/* <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {image !== null && image !== '' && <img src={image} alt="ima" />}
        </div> */}
        <p>{decryptedData}</p>
      </div>
      ) }
       {edit && (
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
      ) }
    </div>
  );
};

export default EntryDetails;
