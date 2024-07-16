import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyATVj34ix-WisTwZ1QskM5IdFENmcuXj_g",
  authDomain: "workspace-clone-43af4.firebaseapp.com",
  projectId: "workspace-clone-43af4",
  storageBucket: "workspace-clone-43af4.appspot.com",
  messagingSenderId: "639423935602",
  appId: "1:639423935602:web:12dd78c61529078ec17eeb"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };