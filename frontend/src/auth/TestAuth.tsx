import { useState } from "react";
import {
  handleSignup,
  handleLogin,
  handleLogout
} from './auth';

const TestAuth: React.FC = () => {
  const [currentUserEmail, setCurrentUserEmail] = useState(""); 
  const [currentUserPassword, setCurrentUserPassword] = useState("");

  function generateRandomString(length: number) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  
  function generateRandomEmail() {
    return generateRandomString(10) + "@" + generateRandomString(5) + ".com";
  }
  
  function generateRandomPassword() {
    return generateRandomString(15);
  }

  return (
    <>
      <p
        style={{ margin: "1.5rem", fontSize: "2rem" }}
      >
        Test Signup/Login
      </p>
      <button
        onClick={async () => {
          console.log("Signing up...");
          const newUserEmail = generateRandomEmail();
          const newUserPassword = generateRandomPassword();
          setCurrentUserEmail(newUserEmail);
          setCurrentUserPassword(newUserPassword);
          const result = await handleSignup({
            email: newUserEmail,
            password: newUserPassword,
            firstName: "Rin",
            lastName: "Wock",
            role: "client",
            company: "Rinwock"
          });
          console.log(result);
        }}
        style={{ margin: "1rem", padding: "1rem 2rem", borderRadius: "15px", background: "green", color: "white",
                fontSize: "1rem", fontFamily: "sans-serif", cursor: "pointer"}}>
          Sign Up w/ Random Email and Password
      </button>

      <button
        onClick={async () => {
          console.log("Logging in...");
          const result = await handleLogin({
            email: currentUserEmail,
            password: currentUserPassword
          });
          console.log(result);
        }}
        style={{ padding: "1rem 2rem", borderRadius: "15px", background: "yellow", color: "black",
                fontSize: "1rem", fontFamily: "sans-serif", cursor: "pointer"}}>
        Log In (Click After Signing Up)
      </button>

      <p
        style={{ margin: "1.5rem", fontSize: "2rem" }}
      >
        Test Logout
      </p>
      <button
        onClick={async () => {
          console.log("Logging out...");
          const result = await handleLogout();
          console.log(result);
        }}
        style={{ margin: "1rem", padding: "1rem 2rem", borderRadius: "15px", background: "red", color: "white",
                fontSize: "1rem", fontFamily: "sans-serif", cursor: "pointer"}}>
          Log Out
      </button>
    </>
  )
}

export default TestAuth;