// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgr_vnbhFxsD3dM1IvROv6gRmdAq-ZFPc",
  authDomain: "mearn-blog-29cbc.firebaseapp.com",
  projectId: "mearn-blog-29cbc",
  storageBucket: "mearn-blog-29cbc.appspot.com",
  messagingSenderId: "862933082272",
  appId: "1:862933082272:web:3f81b35f6191b5674e69c5",

  
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

// export default app;
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);