import { collection, doc, getDoc, onSnapshot } from "@firebase/firestore";
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { db } from "../lib/firebase/auth";
import { stateContext } from "../App";
import Decrypt from "../components/decrypt";
import forge from "node-forge";
import Crypto from "crypto-js";

const EntryDetails = () => {
  const { id } = useParams();
  const [entryData, setEntryData] = useState(null);
  const { setLoading, loading } = useContext(stateContext);

  useEffect(() => {
    setLoading(true);

    const fetchDocument = async () => {
      try {
        const docRef = doc(db, "Entries", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const entryData = { ...docSnap.data(), id: docSnap.id };
          setEntryData(entryData);
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
    // const unsubscribe = getDoc(collection(db, "Entries"), (snapshot) => {
    //   try {
    //     const newData = snapshot.docs?.map((doc) => ({
    //       ...doc.data(),
    //       id: doc.id,
    //     }));
    //     const filteredData = newData.filter((data) => data?.id === id);

    //     setEntryData(filteredData[0]);
    //     setLoading(false);
    //   } catch (error) {
    //     console.log(error);
    //     setLoading(false);
    //   }
    // });
    // return () => unsubscribe();
  }, []);

  console.log(entryData);
  if (entryData !== null && entryData.key !== undefined) {
    var title = entryData.title;
    var encryptedData = entryData.encryptedData;
    var key = entryData.key;
    var iv = entryData?.iv;
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

  console.log(decryptedData);

  // const decryptedByte = Crypto.AES.decrypt(encryptedData, key)
  // const decryptedText = decryptedByte.toString(CryptoJS.enc.Utf8)
  // console.log(decryptedText)

  return (
    <div style={{width: '100vw', height: '100vh', backgroundColor: 'white'}}>
      <div className="entry-detail">
        {loading ? <p>Loading...</p> : <p>{title}</p>}
        <p>{decryptedData}</p>
      </div>
    </div>
  );
};

export default EntryDetails;
