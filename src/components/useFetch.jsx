import { useState, useEffect } from "react";
import { db } from "../lib/firebase/auth";
import { onSnapshot, collection } from "@firebase/firestore";
import { useAuth } from "../lib/firebase/auth";
import forge from "node-forge";

function UseFetch(collectionName) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isOpen, setIsOpen] = useState(false);
  const [profileIsShown, setProfileIsShown] = useState(false);
  const [grid, setGrid] = useState(true);
  const [read, setRead] = useState(false);
  const [edit, setEdit] = useState(false);
  const [search, setSearch] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQueryEntry, setSearchQueryEntry] = useState([]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);

    
  };
  const handleClearSearch = () => {
    console.log("clicked");
    setSearchTerm("");
  };

  const handleTileClick = (index) => {
    setActiveIndex(index);
  };

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

  const FilteredSearch = data.filter((entry) => {
    const decipher = forge.cipher.createDecipher("AES-CBC", entry?.key);
    decipher.start({ iv: entry?.iv });
    decipher.update(forge.util.createBuffer(entry?.encryptedData));
    decipher.finish();
    const decryptedData = decipher.output.toString("utf8");

    // console.log(data.title);

    const matchesSearchTerm =
      entry.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      decryptedData?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearchTerm;
  });

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
    handleSearchChange,
    searchQueryEntry,
    setSearchQueryEntry,
    FilteredSearch,
    search,
    setSearch,
  };
}

export default UseFetch;
