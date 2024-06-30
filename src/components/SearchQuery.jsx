import { React, useContext } from "react";
import { stateContext } from "../App";
import { FaSearch } from "react-icons/fa";
import { AiFillCloseCircle } from "react-icons/ai";
import forge from "node-forge";

const SearchQuery = () => {
  const {
    data,
    searchTerm,
    handleClearSearch,
    handleSearchChange,
    searchQueryEntry,
    setSearchQueryEntry,
    FilteredSearch, 
    setSearch
  } = useContext(stateContext);

  // const FilteredSearch = data.filter((entry) => {
  //   const decipher = forge.cipher.createDecipher("AES-CBC", entry?.key);
  //   decipher.start({ iv: entry?.iv });
  //   decipher.update(forge.util.createBuffer(entry?.encryptedData));
  //   decipher.finish();
  //   const decryptedData = decipher.output.toString("utf8");

  //   // console.log(data.title);

  //   const matchesSearchTerm =
  //     entry.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     decryptedData?.toLowerCase().includes(searchTerm.toLowerCase());

  //   return matchesSearchTerm;
  // });

 console.log(FilteredSearch);
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
              setSearch(false)
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SearchQuery;
