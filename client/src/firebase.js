// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_GOOGLEAPI,
  authDomain: "real-estate-32148.firebaseapp.com",
  projectId: "real-estate-32148",
  storageBucket: "real-estate-32148.appspot.com",
  messagingSenderId: "156446527380",
  appId: "1:156446527380:web:c8ee35be2b7e46045c0981",
  measurementId: "G-CL4T07PZGN"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);