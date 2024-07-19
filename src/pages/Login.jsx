import React, { useState } from "react";
import { ref, get, child } from "firebase/database";
import { auth, database } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [error, setError] = useState(null);
  const nav = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Lấy dữ liệu người dùng từ Firebase Realtime Database
      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.email === "admin@gmail.com") {
          nav("/admin");
        } else {
          nav("/employee");
        }
      } else {
        setError("User data not found");
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Sign in </h1>
      <form onSubmit={(e) => handleLogin(e)}>
        <input
          name="email"
          type="email"
          placeholder="Enter your email"
          required
        />
        <br />
        <input
          name="password"
          type="password"
          placeholder="Enter your password"
          required
        />
        <br />
        <button>Sign In</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default Login;
