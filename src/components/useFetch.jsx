import { useState, useEffect } from "react";
import { db } from "../lib/firebase/auth";
import { onSnapshot, collection } from "@firebase/firestore";
import { useAuth } from "../lib/firebase/auth";

function UseFetch(collectionName) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isOpen, setIsOpen] = useState(false);
  const [profileIsShown, setProfileIsShown] = useState(false);
  const [grid, setGrid] = useState(true)
  const [read, setRead] = useState(false);
  const [edit, setEdit] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);

  }

  const handleClearSearch = () => {
    console.log('clicked')
    setSearchTerm('')
  }


  const handleTileClick = (index) => {
    setActiveIndex(index)
  }



  const showProfileHandler = () => {
    setProfileIsShown(!profileIsShown);
  };

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

  const today = new Date();
  const daysOfTheWeekNumber = today.getDay();
  const daysOfTheWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayOfTheWeek = daysOfTheWeek[daysOfTheWeekNumber];

  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  const formattedDate = `${dayOfTheWeek}, ${day}/${month}/${year}`;

  const handleToggleExpanded = () => {
    setExpanded(!expanded);
  };
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
          const filteredData = newData.filter(
            (data) => data.userId === currentUser?.uid
          );

          setData(filteredData);
          setLoading(false);
        } catch (error) {
          console(error);
          setLoading(false);
        }
      }
    );
    return () => unsubscribe();
  }, [collectionName, currentUser]);

  

  return {
    data,
    loading,
    setLoading,
    currentUser,
    expanded,
    setExpanded,
    handleToggleExpanded,
    formattedDate,
    theme,
    setTheme,
    isOpen,
    setIsOpen,
    toggleTheme,
    showProfileHandler,
    profileIsShown,
    grid,
    setGrid,
    read,
    setRead,
    activeIndex,
    handleTileClick,
    edit,
    setEdit,
    searchTerm,
    handleClearSearch,
    handleSearchChange
  };
}

export default UseFetch;
