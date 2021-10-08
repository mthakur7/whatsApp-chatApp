import React, { useState, useEffect } from "react";

import { Avatar, IconButton } from "@material-ui/core";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { SearchOutlined } from "@material-ui/icons";
import SidebarChat from "./SidebarChat";
import db from "./firebase";
import { useStateValue } from "./StateProvider";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Tooltip from "@material-ui/core/Tooltip";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { useHistory } from "react-router";
import {auth} from './firebase'
import  {actionTypes}  from "./reducer";


function Sidebar(props) {
  const [rooms, setRooms] = useState([]);
  const [{ user }, dispatch] = useStateValue();

  const [open, setOpen] = React.useState(false);
  const [chatRoom, setChatRoom] = React.useState("");
  const history =useHistory();

  useEffect(() => {
    //goto rooms collection in db of firebase, take snapshot of list
    const unsubscribe = db.collection("rooms").onSnapshot((snapshot) =>
      setRooms(
        snapshot.docs.map(
          (
            doc //docs means all the elements of the collection
          ) => ({
            id: doc.id, //unqiue id of each element
            data: doc.data(),
          })
        )
      )
    );

    //unmounting
    return () => {
      unsubscribe();
    };
  }, []);


// new chat
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    const roomName = chatRoom;
    if (roomName) {
      db.collection("rooms").add({
        name: roomName,
      });
    }
    setOpen(false);
    setChatRoom("")
  };

//   signout
const signout=()=>{
    // if (user)
     auth.signOut();
     dispatch({
                    type: actionTypes.SET_USER,
                    user: null,
                })
 
 history.push('/');
}

  return (
    <div className="sidebar">
      <div className="sidebar_header">
      {/* sidebar header------------------------------------------------------------ */}
        <Avatar src={user?.photoURL} />
        <div className="sidebar_headerRight">

 <Tooltip title="status">
            <IconButton>           
              <DonutLargeIcon />              
            </IconButton>
          </Tooltip>

          <Tooltip title="New Chat">
            <IconButton>
              <div className="sidebar_createChat">
                <ChatIcon onClick={handleClickOpen} />
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="form-dialog-title"
                >
                <p className="newChat_create">Create Chat Room</p>
                <p className="newChat_room">Room Name</p>
                  <input
                    type="text"
                    value={chatRoom}
                    onChange={(e) => setChatRoom(e.target.value)}
                    className="newChat_inp"
                    autoFocus
                  />
                  <DialogActions>
                    <button onClick={handleClose} className="newChat_btn" >CANCEL</button>
                    <button onClick={handleClose} className="newChat_btn" disabled={!chatRoom}>CREATE</button>
                  </DialogActions>
                </Dialog>
              </div>
            </IconButton>
          </Tooltip>

          <Tooltip title="Logout">
            <IconButton>
              <ExitToAppIcon onClick={signout}/>
            </IconButton>
          </Tooltip>
        </div>
      </div>

      <div className="sidebar_search">
        <div className="sidebar_searchContainer">
          <SearchOutlined />
          {/*search icon */}
          <input type="text" placeholder="Search or start new chat" />
        </div>
      </div>
      <div className="sidebar_chats">
        <SidebarChat addNewChat />
        {rooms.map((room) => (
          <SidebarChat key={room.id} id={room.id} name={room.data.name} />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
