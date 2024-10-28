import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC1RlLuWgkfJpE-5H3N15z3qGLCTGGy4hE",
  authDomain: "taxicooo.firebaseapp.com",
  projectId: "taxicooo",
  storageBucket: "taxicooo.appspot.com",
  messagingSenderId: "811972065325",
  appId: "1:811972065325:web:59efc86ec0c616d57b60a4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);