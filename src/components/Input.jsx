
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import {v4 as uuid} from "uuid"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../firebase";
import { FaImage, FaPaperPlane } from "react-icons/fa6";

const Input = () => {
  
  const [ text, setText ] = useState("");
  const [ img, setImg ] = useState(null);
  const { currentUser} = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    // Check whether they have image or not through update array
    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (err) => {
          console.log(err);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    }else{
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          // Use uuid package
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        })
      })
    }

    // Update userChats
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId+".lastMessage"]:{
        text
      },
      [data.chatId+".date"]: serverTimestamp(),
    });
    // Other user
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId+".lastMessage"]:{
        text
      },
      [data.chatId+".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  }

  
  return (
    <div className="input">
      <input type="text" placeholder="Type Something" onChange={(e) => setText(e.target.value)} value={text}/>
      <div className="send">
        <input type="file" style={{display: "none"}} id="user-input" onChange={(e) => setImg(e.target.files[0])}/>
        <label htmlFor="user-input">
           <FaImage className="icon"/>
    
        </label>
        <FaPaperPlane className="icon" onClick={handleSend} />
      </div>
    </div>
  )
}

export default Input