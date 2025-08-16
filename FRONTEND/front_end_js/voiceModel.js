// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Firebase config has been added here in the same line to prevent crashes 
const firebaseConfig = {
  apiKey: "AIzaSyAVbsFHucj0GXOM0cLViDc1Enw0pmULNAQ",
  authDomain: "ec-agentic-ai-db.firebaseapp.com",
  projectId: "ec-agentic-ai-db",
  storageBucket: "ec-agentic-ai-db.firebasestorage.app",
  messagingSenderId: "454169373003",
  appId: "1:454169373003:web:8a422fd4e3b272d3d720ce",
  measurementId: "G-BGSZ0BD2RQ"
};

// Init for Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);



// ============================================= MAIN LOGIC FOR THE VOICE COMMAND AND APPOINTMENT BOOKING ========================================




const API_URL = 'https://ec-agentic-ai-backend-ane4pox4s-saifmks-projects.vercel.app/api/runModel';
let transcript = "";
let DOC_NAME = "";
let APPOINTMENT_TIME = "";
let APPOINTMENT_DATE = "";

// speech -> text logic
window.gettingVoice = function () {
  console.log("OK HERE WE GO");

  const recognizer = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognizer.lang = 'en-US';

  document.getElementById("userSaid").textContent = "Listening...";

  recognizer.onresult = (event) => {
    transcript = event.results[0][0].transcript;
    console.log("YOU SAID:", transcript);
    document.getElementById("userSaid").textContent = "YOU SAID : " + transcript;

    callApi();
  };

  recognizer.onerror = (event) => {
    console.error("Recognition error:", event.error);
    document.getElementById("userSaid").textContent = "Error: " + event.error;
  };

  recognizer.onend = () => {
    console.log("Recognition ended");
  };

  recognizer.start();
};




// call backend to access the dataparser and the intent classification model
async function callApi() {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: transcript })
    });

    console.log("Status:", response.status);
    const text = await response.text();
    console.log("Raw response:", text);

    if (response.ok) {
      const data = JSON.parse(text);
      console.log('API response:', data);
      DOC_NAME = data.doctorName;
      APPOINTMENT_TIME = data.appointmentTime;
      APPOINTMENT_DATE = data.appointmentDate;
    }
  } catch (err) {
    console.error('Error calling API:', err);
  }

  const HOSPITAL_NAME = ["CMH", "APPOLO", "LOTUS", "MANIPAL"];
  const RANDOM_HOSPITAL_NAME = getRandomElement(HOSPITAL_NAME);

  pushToDb(DOC_NAME, APPOINTMENT_TIME, APPOINTMENT_DATE, RANDOM_HOSPITAL_NAME);

  console.log("DOCTOR NAME:", DOC_NAME);
  console.log("APPOINTMENT TIME:", APPOINTMENT_TIME);
  console.log("APPOINTMENT DATE:", APPOINTMENT_DATE);
  console.log("RANDOM HOSPITAL:", RANDOM_HOSPITAL_NAME);
}



// firestore logic and query for pushing data into the firestore db
async function pushToDb(doctorName, appointmentTime, appointmentDate, hospitalName) {
  try {
    await addDoc(collection(db, "DOCTOR_APPOINTMENT"), {
      appointmentDate,
      appointmentTime,
      doctorName,
      hospitalName,
    });
    console.log("APPOINTMENT ADDED TO FIRESTORE");
  } catch (err) {
    console.log("ERROR IN ADDING DATA TO DB", err);
  }
}

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
