import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  // Replace with your actual Firebase project configuration
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
const analytics = getAnalytics(app);
const database = getDatabase(app);

export default database; 
