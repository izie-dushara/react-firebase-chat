import {signOut} from "firebase/auth";
import {auth} from "../firebase";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {FaPowerOff} from "react-icons/fa6";

const Navbar = () => {
  const {currentUser} = useContext(AuthContext);
  
  return (
    <div className="navbar">
      <span className="logo">Chatter Palace</span>
      <div className="user">
        <img src={currentUser.photoURL} alt="" />
        <span>{currentUser.displayName}</span>
        <button onClick={() => signOut(auth)}><FaPowerOff /></button>
      </div>
    </div>
  )
}

export default Navbar