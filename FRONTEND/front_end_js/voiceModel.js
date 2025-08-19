// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import callGemini from "./geminiApiCall.js"

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
const db = getFirestore(app);



// ============================================= MAIN LOGIC FOR THE VOICE COMMAND AND APPOINTMENT BOOKING ========================================




const API_URL = 'https://ec-agentic-ai-backend-ane4pox4s-saifmks-projects.vercel.app/api/runModel';
let transcript = "";
let DOC_NAME = "";
let APPOINTMENT_TIME = "";
let APPOINTMENT_DATE = "";
let INTETNT = "";


// text to voice module function 
function textToSpeechModule(text) {

  try {

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.7;
    utterance.pitch = 2;
    utterance.lang = 'en-US';

    utterance.onstart = () => console.log("Speech started...");
    utterance.onend = () => console.log("Speech finished.");
    utterance.onerror = (e) => console.error("Speech error:", e.error);


    window.speechSynthesis.speak(utterance)

  }
  catch (err) {
    console.error("Text to speech Error:", err.message);
  }

}





// speech -> text logic
window.gettingVoice = function () {
  console.log("OK HERE WE GO");

  const recognizer = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognizer.lang = 'en-US';

  textToSpeechModule("Hi there , how may i help you today?")
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

      // prediction: 'LABEL_3', doctorName: null, appointmentTime: null, appointmentDate: '8/17/2025'}
      INTETNT = data.prediction
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

  if (INTETNT === "LABEL_0") {

    try {
      await addDoc(collection(db, "DOCTOR_APPOINTMENT"), {
        appointmentDate,
        appointmentTime,
        doctorName,
        hospitalName,
      });
      const bookingConfirm = `Your appointment with ${doctorName} has been booked at ${appointmentTime} on ${new Date(appointmentDate).toDateString()} at ${hospitalName}.`
      textToSpeechModule(bookingConfirm)
      console.log("APPOINTMENT ADDED TO FIRESTORE");
    } catch (err) {
      console.log("ERROR IN ADDING DATA TO DB", err);
    }
  }


  // ===================================================================CANCELLATION


  // cancellation of appointment
  else if (INTETNT === "LABEL_1") {

    try {
      const bookingCancelled = `Appointment cancellation pending`;
      textToSpeechModule(bookingCancelled);

      // fetching all docs in the collection
      const snapshot = await getDocs(collection(db, "DOCTOR_APPOINTMENT"));

      // filter docs that match with the date given by the user
      const matchingDocs = snapshot.docs.filter(
        (docSnap) => docSnap.data().appointmentDate === appointmentDate || 
                    docSnap.data().doctorName === doctorName ||
                    docSnap.data().appointmentTime === appointmentTime ||
                    docSnap.data().hospitalName === hospitalName
      );

      // delete each matching doc
      for (const docSnap of matchingDocs) {
        await deleteDoc(doc(db, "DOCTOR_APPOINTMENT", docSnap.id));
        console.log(`Deleted ${docSnap.id}`);
      }

      if (matchingDocs.length === 0) {
        console.log("No appointments found for that date.");
        textToSpeechModule(`I couldn’t find any appointments on ${appointmentDate}`);
      } else {
        textToSpeechModule(
          `All appointments for ${new Date(appointmentDate).toDateString()} have been cancelled.`
        );
      }
    } catch (err) {
      console.log("error removing data :", err);
      textToSpeechModule("There was an error cancelling your appointment.");
    }


  }







  else if (INTETNT === "LABEL_2") {
    const greeting = `Hi , how are you doing today?`
    textToSpeechModule(greeting)
  }
  else if (INTETNT === "LABEL_3") {
    const goodbye = `See You later`
    textToSpeechModule(greeting)
  }
  else {
    const aiResponse = await callGemini(transcript)
    textToSpeechModule(aiResponse)
    
  }



}

// function used to generate the random hospital name , needs to be called with getRandomElement(array name)
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}