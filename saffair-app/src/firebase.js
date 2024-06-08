// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: "AIzaSyBArH3bgJdZRx5kp8eJgWgS7oVGwNQ2Bz8",
  // authDomain: "test-ca362.firebaseapp.com",
  // projectId: "test-ca362",
  // storageBucket: "test-ca362.appspot.com",
  // messagingSenderId: "1014541983110",
  // appId: "1:1014541983110:web:31cac8ce39ac2ee43ee007",
  // measurementId: "G-7DS999J1Q3",
  
  // apiKey: "AIzaSyAgr_vnbhFxsD3dM1IvROv6gRmdAq-ZFPc",
  // authDomain: "mearn-blog-29cbc.firebaseapp.com",
  // projectId: "mearn-blog-29cbc",
  // storageBucket: "mearn-blog-29cbc.appspot.com",
  // messagingSenderId: "862933082272",
  // appId: "1:862933082272:web:3f81b35f6191b5674e69c5",

  apiKey: "AIzaSyDh8PRbsZ6Ovs_IK8fiC4PALuVid7nQ0b8",
  authDomain: "test-f8e24.firebaseapp.com",
  projectId: "test-f8e24",
  storageBucket: "test-f8e24.appspot.com",
  messagingSenderId: "142165432615",
  appId: "1:142165432615:web:ab1944e0df93f575c13102",
  measurementId: "G-42N1GDTTS3"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

// export default app;
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const gestorage = getStorage(app);



// api

// 6Lf1YewpAAAAAE27-KSrUi29qIPNHLXAkYLBItf4
// secret 

// 6Lf1YewpAAAAAGHgwCDhRLikMY4FuaSI9x1FFvDO
// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBArH3bgJdZRx5kp8eJgWgS7oVGwNQ2Bz8",
//   authDomain: "test-ca362.firebaseapp.com",
//   projectId: "test-ca362",
//   storageBucket: "test-ca362.appspot.com",
//   messagingSenderId: "1014541983110",
//   appId: "1:1014541983110:web:31cac8ce39ac2ee43ee007",
//   measurementId: "G-7DS999J1Q3"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
