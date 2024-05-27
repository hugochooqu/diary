import React, { useContext, useState, useEffect } from "react";
import { stateContext } from "../App";
import { collection, onSnapshot } from "@firebase/firestore";
import { db, useAuth } from "../lib/firebase/auth";
import Decrypt from "../components/decrypt";
import { Link } from "react-router-dom";
import { FaEye, FaPaperPlane } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { AiFillCloseCircle } from "react-icons/ai";
import EntryDetails from "./entryDetails";

const PublicDiaries = () => {
  const currentUser = useAuth();
  const { setLoading, read, setRead, handleTileClick, activeIndex } = useContext(stateContext);
  const [publicDiaries, setPublicDiaries] = useState([]);
  const [entryId, setEntryId] = useState('')


  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, "Entries"), (snapshot) => {
      try {
        const newData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        const filteredData = newData.filter((data) => data.isPublic === true);
        console.log(filteredData);
        setPublicDiaries(filteredData);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    });
    console.log(publicDiaries);
    return () => unsubscribe();
  }, [currentUser]);

  const handleReply= () => {
    const emailAddress = currentUser?.email
    const subject = 'response'
    const body = 'body'

    window.location.href = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  return (
    <div className="entries">
      <div className="dashboard-main-main">
      {publicDiaries.length === 0 && <p>Ooops! No Public Diary here</p>}
      <div className={`${read ? "changeGrid" : "entry-tiles"}`}>
        {publicDiaries.map((fav, index) => (
          <div className="entry-tile" key={fav.id} style={{backgroundColor: activeIndex === index? 'rgb(136, 136, 136)' : 'rgb(35, 202, 202)'}}>
            <p className="entry-title">{fav.title}</p>
            <Decrypt
            className='decrypt'
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
                bottom: "15px",
                left: "80px",
              }}
            >
              {/* <FaBookmark onClick={() => handleFavorite(entry.id)} color={entry.isFavorite === true && 'red'} /> */}
              {/* <Link
                to={`/dashboard/${"view"}/${fav.id}`}
                style={{ textDecoration: "none", color: "black" }}
              > */}
                <FaEye title="view" className="views" onClick={() => {setRead(true); handleTileClick(index); setEntryId(fav.id)}} />
              {/* </Link > */}
              <Tooltip anchorSelect=".views">View</Tooltip>
              <Link onClick={handleReply} style={{ textDecoration: "none", color: "black" }}>
                <FaPaperPlane title="reply" className="reply"/>
              </Link>
              <Tooltip anchorSelect=".reply">Reply</Tooltip>

              {/* <FaTrash
                    onClick={() => moveEntryToTrash(fav.id)}
                    className="delete"
                  />
                  <Tooltip anchorSelect=".delete">Move to trash</Tooltip> */}
            </div>
          </div>
        ))}
        {read && (<div className="view">
              <AiFillCloseCircle onClick={() => {setRead(false); handleTileClick(null)}} style={{padding: '20px 10px'}} />
              <EntryDetails index={entryId} />
            </div>)}
      </div>
      </div>
    </div>
  );
};

export default PublicDiaries;
