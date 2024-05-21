import React, { useContext, useState } from "react";
import Modal from "../components/Modal";
import { AiFillCloseCircle } from "react-icons/ai";
import { stateContext } from "../App";
import { useAuth } from "../lib/firebase/auth";
import {
  getAuth,
  deleteUser,
  reauthenticateWithCredential,
} from "@firebase/auth";
import { useNavigate, redirect } from "react-router-dom";

const ViewProfile = () => {
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");

  const auth = getAuth();
  var user = auth?.currentUser;
  console.log(user);
  // const navigate = useNavigate()
  const { showProfileHandler, theme } = useContext(stateContext);
  const currentUser = useAuth();
  const fullName = currentUser?.displayName;

  const nameParts = fullName?.split(" ");
  console.log(nameParts);

  if (nameParts !== undefined && nameParts.length > 0) {
    var [firstName, ...lastName] = nameParts;
    console.log(firstName);
  }
console.log(password)
  const reauthenticateUser = async () => {
    console.log(user, passcode)
    reauthenticateWithCredential(user, password).then(() => {
      console.log('reauthentication successful')
    }).catch ((error) => {
      console.log('An error occured: ',error)
    })
  }

  const deleteUserAccount = async () => {
    try {
      const reauthenticate = await reauthenticateUser();
      console.log(reauthenticate)
      if (reauthenticate) {
        console.log('true')
        await deleteUser(user);
        console.log("User account deleted successfully");
      } else {
        console.log("Failed to re-authenticate user");
      }
    } catch (error) {
      console.error("Error deleting user account: ", error);
    }
    // if (confirmDelete) {
    //   deleteUser(user)
    //     .then(() => {
    //       // User deleted
    //       console.log("successful");
    //       redirect("/signin");
    //     })
    //     .catch((error) => {
    //       window.alert("an error occured");
    //       console.log(error);
    //     });
    // }
  };

console.log(confirmPassword);


  return (
    <Modal className={`${theme}`} onClose={showProfileHandler}>
      <div>
        <AiFillCloseCircle onClick={showProfileHandler} />
        <div>
          <h3 style={{ paddingLeft: "40px" }}>ACCOUNT INFO</h3>
          <form
            className="view-profile"
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div className="profile-input">
              <label>Username</label>
              <input />
            </div>

            <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
              <div className="profile-input">
                <label>First name</label>
                <input placeholder={currentUser ? firstName : "First Name"} />
              </div>
              <div className="profile-input">
                <label>Last name</label>
                <input placeholder={currentUser ? lastName : "Last Name"} />
              </div>
            </div>

            <div className="profile-input">
              <label>Email</label>
              <input placeholder={currentUser ? currentUser.email : "email"} />
            </div>
          </form>
          <button
            onClick={() => {
              setConfirmPassword(!confirmPassword);
            }}
          >
            Delete Account
          </button>
          {confirmPassword && (
            <div className="reauthenticate">
              <AiFillCloseCircle
                onClick={() => {
                  setConfirmPassword(!confirmPassword);
                }}
              />
              <form onSubmit={deleteUserAccount}>
                <label>Confirm Password</label>
                <div style={{ display: "flex", gap: "20px" }}>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="submit">Done</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ViewProfile;
