import React, { useState, useContext } from "react";
import { stateContext } from "../App";
import forge from "node-forge";
import { db, useAuth } from "../lib/firebase/auth";
import { getDatabase, set } from "@firebase/database";
import { addDoc, collection, serverTimestamp } from "@firebase/firestore";
import { FaImage } from "react-icons/fa";
import {
  getStorage,
  uploadBytes,
  ref,
  getDownloadURL,
} from "@firebase/storage";
import {useNavigate } from 'react-router-dom'

const AddEntryForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  const { formattedDate } = useContext(stateContext);

  const currentUser = useAuth();
  const userId = currentUser?.uid;
  console.log(userId);
  const navigate = useNavigate()

  const key = forge.random.getBytesSync(32);
  const iv = forge.random.getBytesSync(16);
  const cipher = forge.cipher.createCipher("AES-CBC", key);
  cipher.start({ iv });
  cipher.update(forge.util.createBuffer(content, "utf8"));
  cipher.finish();
  const encryptedData = cipher.output.getBytes();

  console.log(userId);

  const currentDate = new Date();
  const currentDateString = currentDate.toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!db) {
        throw new Error("Firestore instance 'db' is not initialized.");
      }

      const storage = getStorage();
      const storageRef = ref(storage, "/upload" + image.name);
      await uploadBytes(storageRef, image);

      const downloadURL = await getDownloadURL(storageRef);
      console.log(downloadURL);

      const collectionRef = collection(db, "Entries");
      const entryData = {
        title,
        encryptedData,
        currentDateString,
        userId,
        key,
        iv,
        imageURL: downloadURL,
      };
      await addDoc(collectionRef, entryData);
      console.log("okay");
      navigate('/dashboard')
    } catch (err) {
      console.log(err);
    }

    setTitle("");
    setContent("");
    console.log(title);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "title") setTitle(value);
    if (name === "content") setContent(value);
  };

  console.log(image);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          const maxWidth = 300; // Set the maximum width
          const maxHeight = 300; // Set the maximum height
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            setImage(blob);
          }, selectedFile.type);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(selectedFile);
    }
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
        <div>
          <label htmlFor="image-upload">
            <FaImage style={{ color: "white" }} />
          </label>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              style={{ width: "50px" }}
            />
          )}
        </div>
        <div className="date">
          <button type="submit">Done</button>
          <p style={{color:'white'}}>{formattedDate}</p>
        </div>
      </form>
    </div>
  );
};

export default AddEntryForm;
