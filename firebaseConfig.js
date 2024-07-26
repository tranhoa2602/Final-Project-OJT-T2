// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAxMV_WaWsJc5k05aRDwEPECyaTQOFOEq0",
  authDomain: "ojt-final-project.firebaseapp.com",
  databaseURL: "https://ojt-final-project-default-rtdb.firebaseio.com",
  projectId: "ojt-final-project",
  storageBucket: "ojt-final-project.appspot.com",
  messagingSenderId: "93385684109",
  appId: "1:93385684109:web:b2679eecba8b79784b9ec4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const techRef = ref(database, "technologies");

export { database, auth, techRef, firebaseConfig };
export default app;
