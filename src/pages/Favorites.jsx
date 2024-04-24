import { collection, getDocs, limit, onSnapshot, orderBy, query, where } from '@firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { db, useAuth } from '../lib/firebase/auth';
import { stateContext } from '../App';

const Favorites = () => {
    const [favoriteEntries, setFavoriteEntries] = useState([])
    const currentUser = useAuth()
    const {setLoading, loading} = useContext(stateContext)

    useEffect(() => {
        setLoading(true);
        const unsubscribe = onSnapshot(
          collection(db, 'Entries'),
          (snapshot) => {
            try {
              const newData = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
              }));
              const filteredData = newData.filter((data) => data.userId === currentUser?.uid && data.isFavorite === true);
              
              setFavoriteEntries(filteredData)
              setLoading(false);
    
            } catch (error) {
              console(error);
              setLoading(false);
            }
          }
        );
        return () => unsubscribe()
      }, [ currentUser]);
      
     useEffect(() => {
      const getFavoriteEntries = async () => {
        try {
          const q = query(
            collection(db, "Entries"),
            where('isFavorite' == true),
            orderBy("currentDateString", "desc"),
            limit(3)
          );

          const docSnap = await getDocs(q);
          const favEntries = [];

          docSnap.forEach((doc) => {
            const data = doc.data();
            console.log(data.favorite)

            if (data.userId === uid ) {
            favEntries.push({ id: doc.id, ...doc.data() });}
          });

          if (favEntries !== null) {
            setFavoriteEntries(favEntries);
          } else {
            console.log("No recent entries found!");
          }
        } catch (error) {
          console.error("Error getting recent entries:", error);
        }
      };

      getFavoriteEntries();

  }, []);
  console.log(favoriteEntries);

  return (
   <div className='trash'>
    {favoriteEntries.length === 0 && (<p>No Favorite Entry here</p>)}
    {favoriteEntries.map((fav) => <div key={fav.id}>
        <h3>{fav.title}</h3>
    </div>)}
   </div>
    
  )
}

export default Favorites