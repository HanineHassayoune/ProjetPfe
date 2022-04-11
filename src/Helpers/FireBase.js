import { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";
import firebase from "firebase/app";
import "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7FXkBJdkiPIpA2-kQdaboKnCM4QeJei0",
  authDomain: "reduire-gaspillage-alimentaire.firebaseapp.com",
  projectId: "reduire-gaspillage-alimentaire",
  storageBucket: "gs://reduire-gaspillage-alimentaire.appspot.com/",
  messagingSenderId: "694382982431",
  appId: "1:694382982431:web:2405ccf27aa4b49e5bec2a",
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
export { db };

//var storageRef = firebase.storage().ref();
//const storage = firebase.storage();
const storage = firebase.storage();

export { storage };
