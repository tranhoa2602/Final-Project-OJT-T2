import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getDatabase, ref, get, update } from "firebase/database";
import { Spin, message } from "antd";

const VerifyAccount = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyUserAccount = async () => {
      const params = new URLSearchParams(location.search);
      const email = params.get("email");
      const token = params.get("token");

      if (!email || !token) {
        message.error("Invalid verification link.");
        navigate("/");
        return;
      }

      try {
        const db = getDatabase();
        const userRef = ref(db, "users");
        const snapshot = await get(userRef);
        const users = snapshot.val();

        let userKey = null;
        let userData = null;

        for (let key in users) {
          if (
            users[key].email === email &&
            users[key].verificationToken === token
          ) {
            userKey = key;
            userData = users[key];
            break;
          }
        }

        if (!userKey || !userData) {
          message.error("Invalid verification link.");
          navigate("/");
          return;
        }

        await update(ref(db, `users/${userKey}`), {
          status: "active",
          verificationToken: null,
        });
        message.success("Account verified successfully!");
        navigate("/");
      } catch (error) {
        console.error("Error verifying account:", error);
        message.error("Error verifying account. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    verifyUserAccount();
  }, [location.search, navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {loading ? <Spin size="large" /> : <div>Verification Complete</div>}
    </div>
  );
};

export default VerifyAccount;
