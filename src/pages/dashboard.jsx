import React, { useEffect, useState, useContext } from "react";
import { stateContext } from "../App";
import AddEntryForm from "../components/AddEntryForm";
// import { collection, query, where, getDocs } from "@firebase/firestore";
import { db, useAuth } from "../lib/firebase/auth";
import forge from 'node-forge'
import Decrypt from "../components/decrypt";
import { Link } from "react-router-dom";
import { deleteDoc, doc } from "@firebase/firestore";

const Dashboard =() => {
  const [theme, setTheme] = useState("light");
  const [activeLink, setActiveLink] = useState('home')
  const [userName, setUserName] = useState(null)
  const [userId, setUserId] = useState(null)
  const [userEntries, setUserEntries] = useState(null);
  const [encrypted, setEncrypted] = useState('')
 
 const {data, loading} = useContext(stateContext)
 console.log(data)
// useEffect(()=>{
//   const fetchUserEntries = async () => {
//     try {
//       const collectionRef = collection(db, 'Entries');
//       console.log(userId)
//       const userEntriesQuery = query(collectionRef, where('uid','==', userId))
//       const querySnapshot = await getDocs(userEntriesQuery);
//       console.log('Query', querySnapshot.docs)
//       const entriesData = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       console.log(entriesData)
//       // setUserEntries(entriesData)
//       // console.log('User entries:', userEntries);

//     } catch (err) {
//       console.error('Error fetching user entries:', err)
//     }
//   };

//   fetchUserEntries()
// }, [])
  
  useEffect(() => {
    const urlSearchString = window.location.search;
    const params = new URLSearchParams(urlSearchString)

    setUserName(params.get('email'))
    setUserId(params.get('id'))
    console.log(userName)
    console.log(userId)
  })
  

  const handleLinkClink = (link) => {
    setActiveLink(link)
  } 

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };


 
    const handleDelete =async (id)=> {
      console.log(id)
      try {
        await deleteDoc(doc(db, "Entries", id))
        // window.location.reload()
      } catch (error) {
        console.log('an error occured',error)
      }
    }

  

  // const decipherData = (encryptedData) => {
  //   const decipher = forge.cipher.createDecipher('AES-CBC', )
  // }

  return (
    <div className={`dashboard ${theme}`}>
      <div className="dashboard-sidebar">
        <p className="dashboard-logo">write</p>
        <div className="sidebar-menu">
          <ul >
            <li className={activeLink === 'home' ? 'active' : 'inactive'} onClick={() => handleLinkClink('home')}>Home</li>
            <li className={activeLink === 'notes' ? 'active' : 'inactive'} onClick={() => handleLinkClink('notes')}>Notes</li>
            <li className={activeLink === 'settings' ? 'active' : 'inactive'} onClick={() => handleLinkClink('settings')}>Settings</li>
            <li className={activeLink === 'logout' ? 'active' : 'inactive'} onClick={() => handleLinkClink('logout')}>Logout</li>
          </ul>
        </div>
      </div>
      <div className="dashboard-main">
      {userName? <p>{userName}</p> : <i>undefined</i>}
      <span>
        Dark mode <input type="checkbox" onClick={toggleTheme} />
      </span>
      {loading? <p>Loading...</p>: <div className="dashboard-main-main">
      {activeLink === 'home' ? <div className="entry-tiles">{data.map((entry) => (
        <div className="entry-tile" key={entry.id}>
          <p>{entry.title}</p>
          <Decrypt encryptedData = {entry.encryptedData} decryptKey={entry.key} iv= {entry.iv}/>
          <button><Link to={`/entry/${'view'}/${entry.id}`}>view</Link></button>
          <button><Link to={`/entry/${'edit'}/${entry.id}`}>Edit</Link></button>
          <button onClick={() => handleDelete(entry.id)}>Delete</button>
        </div>
      ))}</div> : null} 
      
      {activeLink === 'notes'? <AddEntryForm /> : null} </div>}
      </div>
    </div>
  );
};

export default Dashboard;
