import React, { useContext } from "react";
import { stateContext } from "../App";
import Decrypt from "../components/decrypt";
import { FaEllipsisV, FaEye, FaHeart, FaLock, FaLockOpen, FaPen, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";


const SearchResult = () => {
  const {
    FilteredSearch,
    grid,
    data,
    theme,

    read,
    setRead,
    activeIndex,
    handleTileClick,
    edit,
    setEdit,
    searchTerm,
    search,
  } = useContext(stateContext);

  return (
    <div className="entries">
      {grid ? (
        <div className={`${read || edit ? "changeGrid" : "entry-tiles"}`}>
          {FilteredSearch.length > 0 && FilteredSearch?.map((entry, index) => (
            <div
              className="entry-tile"
              key={entry.id}
              style={{
                backgroundColor:
                  activeIndex === index
                    ? "rgb(136, 136, 136)"
                    : "rgb(35, 202, 202)",
              }}
            >
              {/* <Link
                    to={`${"view"}/${entry.id}`}
                    style={{
                      
                      textDecoration: "none",
                      color: `${theme === "dark" ? "white" : "black"}`, 
                    }}
                  > */}
              <p className="entry-title">
                {entry.title.slice(0, 15)}
                {entry.title.length > 15 && "..."}
              </p>
              {/* </Link> */}
              <Decrypt
                className="decrypt"
                encryptedData={entry.encryptedData}
                decryptKey={entry.key}
                iv={entry.iv}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "20px",
                  position: "relative",
                  bottom: "-10px",
                  left: "50px",
                }}
              >
                <FaHeart
                  className="favorite"
                  onClick={() => handleFavorite(entry.id)}
                  color={
                    entry.isFavorite === true
                      ? "red"
                      : `${theme === "dark" ? "white" : "black"}`
                  }
                />
                <Tooltip anchorSelect=".favorite">Favorite</Tooltip>

                <FaEye
                  onClick={() => {
                    setRead(true);
                    handleTileClick(index);
                    setEntryId(entry.id);
                    setEdit(false);
                  }}
                  className="views"
                />
                <Tooltip anchorSelect=".views">View</Tooltip>

                {/* <Link
                      to={`${"edit"}/${entry.id}`}
                      style={{
                        textDecoration: "none",
                        color: `${theme === "dark" ? "white" : "black"}`,
                      }}
                    > */}
                <FaPen
                  className="edit"
                  onClick={() => {
                    setEdit(true);
                    setRead(false);
                    handleTileClick(index);
                    setEntryId(entry.id);
                  }}
                />
                {/* </Link> */}
                <Tooltip anchorSelect=".edit">Edit</Tooltip>
                <FaTrash
                  onClick={() => moveEntryToTrash(entry.id)}
                  className="delete"
                />
                <Tooltip anchorSelect=".delete">Move to trash</Tooltip>
                {/* <FaEllipsisV onClick={() => toggleDropdown(index)} />
                    {isOpen[index] && (
                      <ul className={`toggle-menu ${theme}`}>
                        <li onClick={() => handlePublic(entry.id, index)}>
                          {entry.isPublic ? "Make Private" : "Make Public"}
                        </li>
                      </ul>
                    )} */}
                <span onClick={() => handlePublic(entry.id, index)}>
                  {entry.isPublic ? (
                    <FaLockOpen className="private" />
                  ) : (
                    <FaLock className="public" />
                  )}
                </span>
                <Tooltip anchorSelect=".private">Make Private</Tooltip>
                <Tooltip anchorSelect=".public">Make Public</Tooltip>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="entry-lists">
          {FilteredSearch.length > 0 && FilteredSearch?.map((entry, index) => (
            <div className="entry-list" key={index}>
              <Link
                to={`${"view"}/${entry.id}`}
                style={{
                  width: "40px",
                  textDecoration: "none",
                  color: `${theme === "dark" ? "white" : "black"}`,
                }}
              >
                <p>
                  {entry.title.slice(0, 15)}
                  {entry.title.length > 15 && "..."}
                </p>
              </Link>

              <Decrypt
                className="decrypt"
                encryptedData={entry.encryptedData}
                decryptKey={entry.key}
                iv={entry.iv}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "20px",
                  position: "relative",
                  top: "-25px",
                  left: "800px",
                }}
              >
                <FaHeart
                  className="favorite"
                  onClick={() => handleFavorite(entry.id)}
                  color={
                    entry.isFavorite === true
                      ? "red"
                      : `${theme === "dark" ? "white" : "black"}`
                  }
                />
                <Tooltip anchorSelect=".favorite">Favorite</Tooltip>
                <span onClick={() => handlePublic(entry.id, index)}>
                  {entry.isPublic ? (
                    <FaEye className="private" />
                  ) : (
                    <FaEyeSlash className="public" />
                  )}
                </span>
                <Tooltip anchorSelect=".private">Make Private</Tooltip>
                <Tooltip anchorSelect=".public">Make Public</Tooltip>

                <Link
                  to={`${"edit"}/${entry.id}`}
                  style={{
                    textDecoration: "none",
                    color: `${theme === "dark" ? "white" : "black"}`,
                  }}
                >
                  <FaPen className="edit" />
                </Link>
                <Tooltip anchorSelect=".edit">Edit Entry</Tooltip>
                <FaTrash
                  onClick={() => moveEntryToTrash(entry.id)}
                  className="delete"
                />
                <Tooltip anchorSelect=".delete">Move to trash</Tooltip>
                <FaEllipsisV onClick={() => toggleDropdown(index)} />
                {isOpen[index] && (
                  <ul className={`toggle-menu ${theme}`}>
                    <li onClick={() => handlePublic(entry.id, index)}>
                      {entry.isPublic ? "Make Private" : "Make Public"}
                    </li>
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResult;
