// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxMV_WaWsJc5k05aRDwEPECyaTQOFOEq0",
  authDomain: "ojt-final-project-16373.firebaseapp.com",
  databaseURL: "https://ojt-final-project-16373-default-rtdb.firebaseio.com",
  projectId: "ojt-final-project-16373",
  storageBucket: "ojt-final-project-16373.appspot.com",
  messagingSenderId: "93385684109",
  appId: "1:93385684109:web:3def0f69d68890274b9ec4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
