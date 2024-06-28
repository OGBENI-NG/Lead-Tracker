// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAQ7Pkbu3_6aSsblqaUKr6cUDQd9NFIkE",
  authDomain: "link-and-tab-saver.firebaseapp.com",
  projectId: "link-and-tab-saver",
  storageBucket: "link-and-tab-saver.appspot.com",
  messagingSenderId: "433011520397",
  appId: "1:433011520397:web:da5ecbbad04d45282183c4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, set, push, onValue, remove };
