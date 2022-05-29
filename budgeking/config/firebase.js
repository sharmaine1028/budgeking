// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyC8w_951GE3xl3D-5V7NfU-OnIMr3Uj2kA",
  authDomain: "budgeking-fd4fa.firebaseapp.com",
  projectId: "budgeking-fd4fa",
  storageBucket: "budgeking-fd4fa.appspot.com",
  messagingSenderId: "38796120587",
  appId: "1:38796120587:web:8eb9cf464626d4c131ad0e",
  measurementId: "G-DM5GTRTK1C",
};

let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { auth, db, firebase };
