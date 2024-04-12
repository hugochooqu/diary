import { useState, useEffect } from "react";
import { db } from "../lib/firebase/auth";
import { onSnapshot, collection } from "@firebase/firestore";
import { useAuth } from "../lib/firebase/auth";

function UseFetch(collectionName) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentUser = useAuth();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snapshot) => {
        try {
          const newData = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          const filteredData = newData.filter((data) => data.userId === currentUser?.uid);
          
          setData(filteredData)
          setLoading(false);

        } catch (error) {
          console(error);
          setLoading(false);
        }
      }
    );
    return () => unsubscribe()
  }, [collectionName, currentUser]);


  return { data, loading, setLoading, currentUser };
}

export default UseFetch;
