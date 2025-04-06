import { useState } from "react";
import { handleClientSignup, handleClientLogin } from "./auth/clientAuth";

function generateRandomString(length: number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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

function App() {
  const [currentUserEmail, setCurrentUserEmail] = useState(""); 
  const [currentUserPassword, setCurrentUserPassword] = useState("");

  return (
    <>
      <p
        style={{ margin: "1.5rem", fontSize: "2rem" }}
      >
        Test Client Signup/Login
      </p>
      <button
        onClick={async () => {
          const newUserEmail = generateRandomEmail();
          const newUserPassword = generateRandomPassword();
          setCurrentUserEmail(newUserEmail);
          setCurrentUserPassword(newUserPassword);
          await handleClientSignup({
            email: newUserEmail,
            password: newUserPassword
          });
        }}
        style={{ margin: "1rem", padding: "1rem 2rem", borderRadius: "15px", background: "blue", color: "white",
                 fontSize: "1rem", fontFamily: "sans-serif", cursor: "pointer"}}>
          Create User w/ Random Email and Password
      </button>

      <button
        onClick={async () => {
          await handleClientLogin({
            email: currentUserEmail,
            password: currentUserPassword
          });
        }}
        style={{ padding: "1rem 2rem", borderRadius: "15px", background: "white", color: "black",
                 fontSize: "1rem", fontFamily: "sans-serif", cursor: "pointer"}}>
        Log In User (Click After Creating User)
      </button>
    </>
  )
}

export default App
