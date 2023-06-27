import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";


const Message = ({ message }) => {
  const { currentUser} = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();
  useEffect(() => {
    ref.current?.scrollIntoView({behavior:"smooth"})
  }, [message]);
  
  const handleMinutes = (currentMinutes) => {
    return currentMinutes < 10
    ? `0${currentMinutes}`
    : `${currentMinutes}`
  }

  const handleDay = (currentDay) => {
        switch (currentDay) {
          case 0:
            currentDay = 'Thu';
            break;
          case 1:
            currentDay = 'Fri';
            break;
          case 2:
            currentDay = 'Sat';
            break;
          case 3:
            currentDay = 'Sun';
            break;
          case 4:
            currentDay = 'Mon';
            break;
          case 5:
            currentDay = 'Tue';
            break;
        
          default:
            currentDay = 'Wednesday';
            break;
        }

        return currentDay;
  }
 
  const getHours = (t) => {
    const date = new Date(t * 1000);
    const hour = date.getHours()+1;
    const minute = handleMinutes(date.getMinutes());
    // Malaysian time - the server use Singapore time
    return `${hour - 1}:${minute}`
  }

  const getCurrentDay = (t) => {
    const date = new Date(t * 1000);
    const day = handleDay(date.getDay());
    return `${day}`
  }

  return (
    
    <div ref={ref} className={`message ${message.senderId === currentUser.uid && "owner"}`}>
      <div className="message-info">
        <img src={ message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} alt="" loading="lazy"/>
        <span>{getHours(message.date)}</span>
        <span>{getCurrentDay(message.date)}</span>
      </div>
      <div className="message-content">
        
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="" loading="lazy"/>}
      </div>
    </div>
  )
}

export default Message