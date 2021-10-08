import React, { useEffect, useState } from 'react';
import { Avatar } from "@material-ui/core";


import db from './firebase';
import { Link } from 'react-router-dom';

function SidebarChat({ id, name, addNewChat }) {
 window.scrollTo(0, 1000);

    const [seed, setSeed] = useState("");// to generate random strings for Avatar
    const [messages, setMessages] = useState("");

    useEffect(() => {
        if (id) {
            db.collection('rooms').doc(id).collection('messages').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
                setMessages(snapshot.docs.map((doc) => doc.data()))
            })
        }
    }, [id]);

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000)); // we are passing random no. for Avatar       
    }, []);

  
    /*if its not addNewChat then run below code */
    return !addNewChat ? (
        <Link to={`/rooms/${id}`} key={id}>
            <div className="sidebarChat">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />{/*src contains an api which generates random images if we pass some random string after human/ */}
                <div className="sidebarChat_info">
                    <h2>{name}</h2>
                    <p>{messages[0]?.message.toString().slice(0,10)}</p>
                </div>             



            </div>
        </Link>
        //otherwise randor the below code   
    ) :(<></>)
}

export default SidebarChat