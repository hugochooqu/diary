import React, { useContext } from "react";
import { stateContext } from "../App";
import Decrypt from "../components/decrypt";
import { Link } from "react-router-dom";
import { db, useAuth } from "../lib/firebase/auth";
import { deleteDoc, doc } from "@firebase/firestore";
import { FaEye, FaPen, FaTrash } from "react-icons/fa";
import {Tooltip} from 'react-tooltip'

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

  return (
    <div className="entries">
      <div className="dashboard-header" style={{ width: "100vw" }}>
        {/* {userName ? <p>{userName}</p> : <i>undefined</i>}
          <span>
            Dark mode <input type="checkbox" onClick={toggleTheme} />
          </span> */}
        <h1>DEE YA</h1>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="dashboard-main-main" style={{ margin: "auto" }}>
          {data.length === 0 && <p style={{margin:'auto', width:'40%'}}>Oops! No entry here. <Link to='/dashboard' style={{textDecoration:'none'}}>Write now</Link></p>}
          <div className="entry-tiles">
            {data.map((entry) => (
              <div className="entry-tile" key={entry.id}>
                <p>{entry.title}</p>
                <Decrypt
                  encryptedData={entry.encryptedData}
                  decryptKey={entry.key}
                  iv={entry.iv}
                />
                <div style={{display: 'flex', flexDirection:'row', gap:'20px', position: 'relative', bottom:'-120px', left:'100px'}}>
                  <Link to={`/entry/${"view"}/${entry.id}`} style={{textDecoration: 'none', color:'black'}}><FaEye title="view" className="view" /></Link>
                  <Tooltip anchorSelect=".view" >View</Tooltip>
                  <Link to={`/entry/${"edit"}/${entry.id}`} style={{textDecoration: 'none', color:'black'}}><FaPen className="edit" /></Link>
                  <Tooltip anchorSelect=".edit" >Edit</Tooltip>
                  <FaTrash onClick={() => handleDelete(entry.id)} className="delete" />
                  <Tooltip anchorSelect=".delete" >Delete</Tooltip>
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
