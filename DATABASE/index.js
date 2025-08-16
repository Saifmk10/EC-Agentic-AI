import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAVbsFHucj0GXOM0cLViDc1Enw0pmULNAQ",
  authDomain: "ec-agentic-ai-db.firebaseapp.com",
  projectId: "ec-agentic-ai-db",
  storageBucket: "ec-agentic-ai-db.firebasestorage.app",
  messagingSenderId: "454169373003",
  appId: "1:454169373003:web:8a422fd4e3b272d3d720ce",
  measurementId: "G-BGSZ0BD2RQ"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);