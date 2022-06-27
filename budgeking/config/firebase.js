// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
import "firebase/app";
import firestore from "firebase/firestore";
import "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// const firebaseConfig = {
//   apiKey: "AIzaSyC8w_951GE3xl3D-5V7NfU-OnIMr3Uj2kA",
//   authDomain: "budgeking-fd4fa.firebaseapp.com",
//   projectId: "budgeking-fd4fa",
//   storageBucket: "budgeking-fd4fa.appspot.com",
//   messagingSenderId: "38796120587",
//   appId: "1:38796120587:web:8eb9cf464626d4c131ad0e",
//   measurementId: "G-DM5GTRTK1C",
// };

const firebaseConfig = {
  apiKey: "AIzaSyBRt7jiOXsiVoKoMfWJ5VhrISnHZjPNf5c",
  authDomain: "budgeking2.firebaseapp.com",
  projectId: "budgeking2",
  storageBucket: "budgeking2.appspot.com",
  messagingSenderId: "629966382379",
  appId: "1:629966382379:web:1373c035b3d7b8a0be516e",
  measurementId: "G-LL42WC44RG",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();

export { auth, db };
