import { useContext, useState } from "react";
import { collection, query, where, getDoc, getDocs, setDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import {db} from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Search = () => {

  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const {currentUser} = useContext(AuthContext);

  // Use firebase query
  const handleSearch = async () => {
    const q = query(collection(db, "users"), where("displayName", "==", username));
    try{
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    }catch(err){
      setErr(true);
    }

  }
  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  }

  const handleSelect = async () => {
    // Check whether the group(chats in firestore) exists if not create
    const combineId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
    // Check user chats
    try {
      const res = await getDoc(doc(db, "chats", combineId));

      if (!res.exists()) {
        // create a chat in chats collection
        await setDoc(doc(db, "chats", combineId), {messages: []});
        
        // Create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combineId+".userInfo"]:{
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
          },
          [combineId+".date"]: serverTimestamp(),
        })
        await updateDoc(doc(db, "userChats", user.uid), {
          [combineId+".userInfo"]:{
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          },
          [combineId+".date"]: serverTimestamp()
        })
      }

    } catch (err) {setErr(true)}
    setUser(null);
    setUsername("");
  }
  return (
    <div className="search">
      <div className="search-form">
        <input type="text" placeholder="Find a user" onKeyDown={handleKey} onChange={e => setUsername(e.target.value)} value={username}/>
      </div>
      {err && <span>User Not Found</span>}
      {user && <div className="user-chat" onClick={handleSelect}>
        <img src={user.photoURL} alt="" />
        <div className="user-chat-info">
          <span>{user.displayName}</span>
        </div>
      </div>}
    </div>
  )
}

export default Search