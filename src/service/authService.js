//authService.jsx

import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  get,
  set,
  update,
} from "firebase/database";
import bcrypt from "bcryptjs";

// Hàm cập nhật mật khẩu đã mã hóa cho tất cả người dùng hiện có
const updateExistingPasswords = async () => {
  try {
    const db = getDatabase();
    const usersRef = ref(db, "users");
    const snapshot = await get(usersRef);
    const usersData = snapshot.val();

    if (usersData) {
      for (const userId in usersData) {
        const user = usersData[userId];

        // Kiểm tra nếu mật khẩu chưa được mã hóa
        if (user.password && !user.password.startsWith("$2a$")) {
          // Mã hóa mật khẩu
          const hashedPassword = await bcrypt.hash(user.password, 10);

          // Cập nhật mật khẩu đã mã hóa vào cơ sở dữ liệu
          await update(ref(db, `users/${userId}`), {
            password: hashedPassword,
          });

          console.log(`Updated password for user: ${userId}`);
        }
      }
    } else {
      console.log("No users found.");
    }
  } catch (error) {
    console.error("Error updating passwords:", error);
  }
};

// Hàm đăng nhập người dùng
export const loginUser = async (
  email,
  password,
  setUser,
  setError,
  navigate
) => {
  try {
    const db = getDatabase();
    const userRef = ref(db, "users");
    const userQuery = query(userRef, orderByChild("email"), equalTo(email));
    const snapshot = await get(userQuery);
    const userData = snapshot.val();

    console.log("User Data from DB:", userData); // Console log user data

    if (userData) {
      const userId = Object.keys(userData)[0];
      const user = userData[userId];

      // So sánh mật khẩu đã mã hóa
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        localStorage.setItem("userId", JSON.stringify(user)); // Lưu toàn bộ đối tượng người dùng
        setUser(user);

        // Điều hướng dựa trên vai trò người dùng
        if (user.role === "Admin") {
          navigate("/account-management");
        } else {
          navigate("/employee");
        }
        return { user, error: null };
      } else {
        setError("Invalid password");
        return { user: null, error: "Invalid password" };
      }
    } else {
      setError("User not found");
      return { user: null, error: "User not found" };
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
    setError("An error occurred");
    return { user: null, error: "An error occurred" };
  }
};

// Hàm đăng ký người dùng
export const signUpUser = async (
  email,
  password,
  setSuccessMessage,
  setError
) => {
  try {
    const db = getDatabase();
    const userRef = ref(db, "users");
    const userQuery = query(userRef, orderByChild("email"), equalTo(email));
    const snapshot = await get(userQuery);

    console.log("Snapshot for Sign Up Check:", snapshot.val()); // Console log snapshot for sign up

    if (snapshot.val()) {
      setError("Email already in use");
      return { success: false, error: "Email already in use" };
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserRef = ref(db, `users/${email.replace(".", ",")}`);
    const newUser = {
      email,
      password: hashedPassword,
      contact: "",
      cv_list: [
        {
          title: "",
          description: "",
          file: "",
          updatedAt: new Date().toISOString(),
        },
      ],
      role: email === "admin@gmail.com" ? "admin" : "employee",
      createdAt: new Date().toISOString(),
      projetcIds: "",
      skill: "",
      Status: "",
    };
    await set(newUserRef, newUser);

    console.log("New User Object:", newUser); // Console log the new user object

    setSuccessMessage("Account created successfully! Please log in.");
    return { success: true, error: "" };
  } catch (error) {
    console.error("Error signing up: ", error);
    setError("An error occurred during sign up");
    return { success: false, error: "An error occurred during sign up" };
  }
};

// Gọi hàm để mã hóa mật khẩu hiện có (nên chỉ chạy một lần khi cần)
updateExistingPasswords();
