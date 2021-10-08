import './App.css';
import React, {useState,useEffect} from 'react';
import Sidebar from './Sidebar';
import Chat from './Chat';
import Login from './Login';
import { BrowserRouter as Router,Switch, Route} from 'react-router-dom';
import {useStateValue} from './StateProvider';
import { auth } from './firebase';
import { useHistory } from 'react-router';


function App() {
  const [{user}, dispatch] = useStateValue();
  const history=useHistory()
  // to keep track of who has signed in
    useEffect(()=>{
      //as soon as the app loads on signin/sognout we attach this listener
      auth.onAuthStateChanged((authUser) => {
        //if there is an authorized user
  if (authUser) {
          // the user just logged in / the user was logged in
  
          dispatch({
            type: "SET_USER",
            user: authUser,
          });
          history.push('/rooms')
        } else {
          // the user is logged out
          dispatch({
            type: "SET_USER",
            user: null,
          });
        }
      });
   
    },[]);


  return (
    <div className="app">
     <div className="app_green"></div>
        {!user ? ( //if there is no user then show login page
          <Login/>
        ):(//else show the app
        <>
          <div className="app_body">
            <Router>
              <Sidebar/>
              <Switch>
                <Route path="/rooms/:roomId">
                  <Chat/>
                </Route>
                <Route exact path="/">
                  <Chat/>
                </Route>     
                <Route exact path="/login">
                  <Login/>
                </Route>          
              </Switch>            
            </Router>
          </div>
       
          </>
        )}
       
    </div>
  );
}

export default App;

//link
// https://whatsapp-firebase-c508b.web.app