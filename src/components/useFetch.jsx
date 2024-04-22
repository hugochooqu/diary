import { useState, useEffect } from "react";
import { db } from "../lib/firebase/auth";
import { onSnapshot, collection } from "@firebase/firestore";
import { useAuth } from "../lib/firebase/auth";

function UseFetch(collectionName) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false)

  const today = new Date();
  const daysOfTheWeekNumber = today.getDay()
  const daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayOfTheWeek = daysOfTheWeek[daysOfTheWeekNumber]

  const day = today.getDate()
  const month = today.getMonth() + 1;
  const year = today. getFullYear()

  const formattedDate = `${dayOfTheWeek}, ${day}/${month}/${year}`

  const handleToggleExpanded = () => {
    setExpanded(!expanded)
  }
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


  return { data, loading, setLoading, currentUser, expanded, setExpanded, handleToggleExpanded, formattedDate };
}

export default UseFetch;
