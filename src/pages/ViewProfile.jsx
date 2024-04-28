import React, { useContext } from "react";
import Modal from "../components/Modal";
import { AiFillCloseCircle } from "react-icons/ai";
import { stateContext } from "../App";
import { useAuth } from "../lib/firebase/auth";

const ViewProfile = () => {
  const { showProfileHandler, theme } = useContext(stateContext);
  const currentUser = useAuth()
  const fullName = currentUser?.displayName

  const nameParts = fullName?.split(' ')
  console.log(nameParts)

  if (nameParts !== undefined && nameParts.length > 0) {
    var [firstName, ...lastName] = nameParts
    console.log(firstName)
  }
  return (
    <Modal className={`${theme}`} onClose={showProfileHandler}>
      <div>
        <AiFillCloseCircle onClick={showProfileHandler} />
        <div>
          <h3 style={{paddingLeft:'40px'}}>ACCOUNT INFO</h3>
          <form className="view-profile" style={{display:'flex', flexDirection:'column', gap:'20px'}}>
            <div className="profile-input">
              <label>Username</label>
              <input />
            </div>
          
            <div style={{display:"flex", flexDirection:'row', gap:'10px'}} >
              <div className="profile-input">
                <label>First name</label>
                <input placeholder={currentUser? firstName :'First Name'} />
              </div>
              <div className="profile-input">
                <label>Last name</label>
                <input placeholder={currentUser? lastName: 'Last Name'} />
              </div>
            </div>

            <div className="profile-input">
                <label  >Email</label>
                <input placeholder={currentUser? currentUser.email : 'email'} />
              </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default ViewProfile;
