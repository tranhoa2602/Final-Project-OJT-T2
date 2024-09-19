import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDlrZJmF46pNb7XjDTq7gd5aTGX3ic7aEE",
  authDomain: "final-project-ojt-t2.firebaseapp.com",
  databaseURL: "https://final-project-ojt-t2-default-rtdb.firebaseio.com",
  projectId: "final-project-ojt-t2",
  storageBucket: "final-project-ojt-t2.appspot.com",
  messagingSenderId: "299904390495",
  appId: "1:299904390495:web:fbc9524dd715781739d2ea",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

const techRef = ref(database, "technologies");

export { database, auth, techRef, storage, firebaseConfig };
export default app;
