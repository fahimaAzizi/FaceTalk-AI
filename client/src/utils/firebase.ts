import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB6nS1L8hkmojq1IjF_gJXst-47uZ8zFEo",
  authDomain: "facetalking-ai.firebaseapp.com",
  projectId: "facetalking-ai",
  storageBucket: "facetalking-ai.firebasestorage.app",
  messagingSenderId: "756786655148",
  appId: "1:756786655148:web:52f1c4ebd2cd20f14ad409",
  measurementId: "G-YLDS11EYCN"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
