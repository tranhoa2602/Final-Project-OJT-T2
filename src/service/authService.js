import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ref, set, get } from "firebase/database";
import { auth, database } from "../../firebaseConfig";

export const signUp = async (email, password, role) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await set(ref(database, "users/" + user.uid), { email, role });
    return user;
  } catch (error) {
    throw error;
  }
};

// Hàm đăng nhập người dùng hiện tại
export const logIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const snapshot = await get(ref(database, "users/" + user.uid));
    const userData = snapshot.val();
    return { user, userData };
  } catch (error) {
    throw error;
  }
};
