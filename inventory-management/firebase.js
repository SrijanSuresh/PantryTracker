
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
 
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2EwJr9R3GSnk8hj5NG5b3WtUTefLrC70",
  authDomain: "pantryproject-f4b21.firebaseapp.com",
  projectId: "pantryproject-f4b21",
  storageBucket: "pantryproject-f4b21.appspot.com",
  messagingSenderId: "297505440941",
  appId: "1:297505440941:web:a62a6003656d2f48acf224",
  measurementId: "G-RMLSZ1NQGB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export { firestore };

