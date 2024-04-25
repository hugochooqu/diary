import React, {useContext, useState, useEffect} from 'react'
import { stateContext } from '../App';
import { collection, onSnapshot } from '@firebase/firestore';
import { db, useAuth } from '../lib/firebase/auth';
import Decrypt from '../components/decrypt';
import { Link } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import {Tooltip } from 'react-tooltip'

const PublicDiaries = () => {

    const currentUser = useAuth()
    const {setLoading} = useContext(stateContext)
    const [publicDiaries, setPublicDiaries] = useState([])

    useEffect(() => {
        setLoading(true);
        const unsubscribe = onSnapshot(collection(db, "Entries"), (snapshot) => {
          try {
            const newData = snapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));
            const filteredData = newData.filter(
              (data) => data.isPublic === true
            );
            console.log(filteredData)
            setPublicDiaries(filteredData);
            setLoading(false);
          } catch (error) {
            console.log(error);
            setLoading(false);
          }
        });
        console.log(publicDiaries)
        return () => unsubscribe();
      }, [currentUser]);
  return (
    <div className="trash">
      {publicDiaries.length === 0 && <p>Ooops! No Public Diary here</p>}
      <div className="trash-tiles">
      {publicDiaries.map((fav) => (
        <div className="trash-tile" key={fav.id}>
          <h3>{fav.title}</h3>
          <Decrypt
            encryptedData={fav.encryptedData}
            decryptKey={fav.key}
            iv={fav.iv}
          />
          <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "20px",
                    position: "relative",
                    bottom: "-10px",
                    left: "80px",
                  }}
                >
                  {/* <FaBookmark onClick={() => handleFavorite(entry.id)} color={entry.isFavorite === true && 'red'} /> */}
                  <Link
                    to={`/dashboard/${"view"}/${fav.id}`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <FaEye title="view" className="view" />
                  </Link>
                  <Tooltip anchorSelect=".view">View</Tooltip>
                  
                  {/* <FaTrash
                    onClick={() => moveEntryToTrash(fav.id)}
                    className="delete"
                  />
                  <Tooltip anchorSelect=".delete">Move to trash</Tooltip> */}
                </div>
        </div>
      ))}</div>
    </div>
  )
}

export default PublicDiaries