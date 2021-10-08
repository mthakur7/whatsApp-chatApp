import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC4ULeTS7LnMlQ38NEaJ5lOUzIuR5S9TaU",
    authDomain: "whatsapp-firebase-c508b.firebaseapp.com",
    projectId: "whatsapp-firebase-c508b",
    storageBucket: "whatsapp-firebase-c508b.appspot.com",
    messagingSenderId: "165611421400",
    appId: "1:165611421400:web:e3005d9e817d92d96d61ad",
    measurementId: "G-C2XTZSD2KK"
  };

  
  const firebaseApp = firebase.initializeApp(firebaseConfig);//to initialize our app with firbase 
  const db = firebaseApp.firestore(); //to get database
  const auth = firebaseApp.auth(); //for authentication
  const provider = new firebase.auth.GoogleAuthProvider(); //for google authoriztion, means for signin page

  export {auth,provider};
  export default db;