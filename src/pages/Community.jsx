import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Community = () => {
  const history = useNavigate();

  const Back = () => {
    history(-1);
  };
  return (
    <div className="coming-soon">
      <p onClick={Back} style={{ cursor: "pointer" }}>
        <FaArrowLeft /> Back
      </p>

      <h1>COMING SOON!!!</h1>
    </div>
  );
};

export default Community;
