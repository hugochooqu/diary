import { React, useContext } from "react";
import { stateContext } from "../App";
import { FaSearch } from "react-icons/fa";
import { AiFillCloseCircle } from "react-icons/ai";

const SearchQuery = () => {
  const { data, searchTerm, handleClearSearch, handleSearchChange } =
    useContext(stateContext);

  const FilteredSearch = data.filter((entry) => {
    console.log(data.title)
   const matchesSearchTerm =
      entry.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearchTerm;
  });

  console.log(FilteredSearch)
  return (
    <div className="search">
      <FaSearch className="icon" color="white" />
      <input
        placeholder="search"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {searchTerm && (
        <div className="search-cancel">
          <AiFillCloseCircle
            color="white"
            onClick={() => {
              handleClearSearch();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SearchQuery;
