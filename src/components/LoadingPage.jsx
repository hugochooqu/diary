import React from "react";
import { ThreeDots } from "react-loader-spinner";

const LoadingPage = () => {
  return (
    <div className="loading">
      <div className="loading-body">
        <h3>WRITE</h3>
        <ThreeDots height="80"
  width="80"
  color="grey"
  radius="9"
  ariaLabel="three-dots-loading"
  wrapperStyle={{}}
  wrapperClass=""/>
      </div>
    </div>
  );
};

export default LoadingPage;
