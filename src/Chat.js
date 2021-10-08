import React, {useState,useEffect} from 'react';
import {Avatar, IconButton} from '@material-ui/core';
import {AttachFile, ExpandLessSharp, MoreVert, SearchOutlined} from '@material-ui/icons';
import MicIcon from '@material-ui/icons/Mic';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import ChatLandingPage from "./ChatLandingPage";
import { useParams } from 'react-router-dom';
import db from './firebase';
import firebase from 'firebase';
import {useStateValue} from "./StateProvider";
import Picker from 'emoji-picker-react';

function Chat() {

    const [input, setInput] = useState("");
    const [seed, setSeed] = useState("");
    const {roomId} = useParams();
    const [roomName, setRoomName] = useState("");
    const [messages, setMessages] = useState([]);
    const [{user}, dispatch] = useStateValue();

   

    const onEmojiClick = (event, emojiObject) => {      
    setInput(input+emojiObject.emoji)
    };

    //to change the room name of chat header on clicking a room
    useEffect(()=>{
        if(roomId){
            db.collection('rooms').doc(roomId).onSnapshot(snapshot => {
                setRoomName(snapshot.data().name);
            });

            db.collection('rooms').doc(roomId).collection("messages").orderBy("timestamp","asc").onSnapshot(snapshot => {
                setMessages(snapshot.docs.map(doc => doc.data()))
            });

        }
    },[roomId])

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));        
    }, [roomId]);

    const sendMessage = (e) => {
        e.preventDefault();
        db.collection('rooms').doc(roomId).collection('messages').add({
            message: input,
            name: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })

        setInput("");
    }

    const show_emojiBox=()=>{
        if( document.getElementsByClassName("chat_emoji")[0].style.display=='none')
        document.getElementsByClassName("chat_emoji")[0].style.display='block';
        else{
            document.getElementsByClassName("chat_emoji")[0].style.display='none';
        }
    }
    return (
        <div className='chat'>
        {roomId?
        <>
        <div className='chat_header'>
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
                <div className='chat_headerInfo'>
                    <h3 className='chat-room-name'>{roomName}</h3>
                    <p className='chat-room-last-seen'>
                       
                       {messages.length>0 ?
                       <>
                       Last seen {" "}
                       
                       {new Date(
                            messages[messages.length - 1]?.
                            timestamp?.toDate()
                        ).toLocaleTimeString()}
                        </>:
                        <>
                           Not seen recently
                        </>
                        }
                    </p>
                </div>
                <div className="chat_headerRight">
                    <IconButton>
                        <SearchOutlined/>
                    </IconButton>
                    <IconButton>
                        <AttachFile/>
                    </IconButton>
                    <IconButton>
                        <MoreVert/>
                    </IconButton>
                    
                </div>
            </div>
            <div className='chat_body'>
                {messages.map(message => (
                    //if message is sent by user/logged in person than it will be light green otherwise it will be white                   
                    <p className={`chat_message ${ message.name == user.displayName && 'chat_receiver'}`}>
                        <p className="chat_name">{message.name}</p>
                        <p>{message.message}</p>
                        <p className="chat_timestemp">{new Date(message.timestamp?.toDate()).toLocaleTimeString( "en-US",
                        {
                          hour: "numeric",
                          hour12: true,
                          minute: "numeric",
                        })}</p>
                    </p>
                ))}
            </div>
            <div className="chat_emoji">     
      <Picker onEmojiClick={onEmojiClick} />
    </div>
            <div className='chat_footer'>
       
                <InsertEmoticonIcon onClick={show_emojiBox} style={{cursor:'pointer'}}/>
                <form>
                    <input value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="Type a message"/>
                    <button type="submit" onClick={sendMessage}> Send a Message</button>
                </form>
                <MicIcon/> 
            </div>
            </>
            :<ChatLandingPage/>}
            
        </div>
    )
}

export default Chat