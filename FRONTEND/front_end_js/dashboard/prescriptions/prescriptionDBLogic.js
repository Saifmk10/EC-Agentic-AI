import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { imageTextExtraction, geminiDataParsing } from "./prescriptionParser.js"

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


  console.log("THE BELLOW OUTPUT IS COMING FROM prescriptionParser.js path is EC-Agentic-AI\FRONTEND\front_end_js\dashboard\prescriptions\prescriptionParser.js")
  const finalOutput = await imageTextExtraction()
  // console.log("FINAL OUTPUT : ", finalOutput)

  const parsedOutput = await geminiDataParsing(finalOutput)
  // console.log("PARSED OUTPUT : ", parsedOutput.medicines[0])


async function pushingPrescriptionDataToDB() { // there in this function the details are being taken form the prescriptionParser.js
 
  let numberOfMedications = parsedOutput.medicines.length //  this is gonna give a lenght of the meds added but wont give lenght for all the elements within the array getting returned , so well need to assume its gonna be right
  // let medicine = ""
  // let dose = ""
  // let timing = ""

  // for (let i =0 ; i<numberOfMedications ; i++){
  //   console.log("MEDICINE NAME : ", parsedOutput.medicines[i])
  //   console.log("DOSEAGE : ", parsedOutput.doses[i])
  //   console.log("TIMING : ", parsedOutput.timings[i])

  //   let medicine = parsedOutput.medicines[i];
  //   let dose = parsedOutput.doses[i];
  //   let timing = parsedOutput.timings[i]
  // }

  try {
        await addDoc(collection(db, "USERS_PRESCRIPTIONS"), {
          medicine : parsedOutput.medicines,
          dose : parsedOutput.doses,
          timing : parsedOutput.timings,
        });
        // const bookingConfirm = `Your appointment with ${doctorName} has been booked at ${appointmentTime} on ${new Date(appointmentDate).toDateString()} at ${hospitalName}.`
        // document.getElementById("agentSaid").textContent = "AGENT : " + bookingConfirm;
        // textToSpeechModule(bookingConfirm)
        console.log("APPOINTMENT ADDED TO FIRESTORE");
      } catch (err) {
        console.log("ERROR IN ADDING DATA TO DB", err);
      }

}

pushingPrescriptionDataToDB() 