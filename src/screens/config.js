// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeQlyvh9_N6qcOVeOwzBS2xCFyhqOlLqg",
  authDomain: "chama-9361f.firebaseapp.com",
  databaseURL: "https://chama-9361f-default-rtdb.firebaseio.com",
  projectId: "chama-9361f",
  storageBucket: "chama-9361f.appspot.com",
  messagingSenderId: "1041199285337",
  appId: "1:1041199285337:web:76417907fb1bfaecac9d48"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const DB = getDatabase(app);

export default DB; 