/*
Here is an example file for firebase calls. This was taken from the same ADR-Web repository, but
another great example is the work done for is the H4I Application Portal.
Link to this file: https://github.com/Hack4Impact-UMD/All-District-Reads-Web/blob/main/client/my-app/src/backend/firebaseCalls.ts
*/
import {
    AuthError,
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
  } from "firebase/auth";
//   import app from "../config/firebase";
  
  export function authenticateUser(email: string, password: string) {
    return new Promise((resolve, reject) => {
      const auth = getAuth(app); // app is usually defined elsewhere
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          resolve(userCredential.user);
        })
        .catch((error: AuthError) => {
          reject(error);
        });
    });
  }
  
  export function registerUser(email: string, password: string) {
    return new Promise((resolve, reject) => {
      const auth = getAuth(app);
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          resolve(userCredential.user);
        })
        .catch((error: AuthError) => {
          reject(error);
        });
    });
  }