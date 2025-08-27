// import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
// import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
// import { handlePrescriptionUpload, imageTextExtraction, geminiDataParsing } from "./prescriptionParser.js"

// // Firebase config has been added here in the same line to prevent crashes 
// const firebaseConfig = {
//   apiKey: "AIzaSyAVbsFHucj0GXOM0cLViDc1Enw0pmULNAQ",
//   authDomain: "ec-agentic-ai-db.firebaseapp.com",
//   projectId: "ec-agentic-ai-db",
//   storageBucket: "ec-agentic-ai-db.firebasestorage.app",
//   messagingSenderId: "454169373003",
//   appId: "1:454169373003:web:8a422fd4e3b272d3d720ce",
//   measurementId: "G-BGSZ0BD2RQ"
// };

// // Init for Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);


//   console.log("THE BELLOW OUTPUT IS COMING FROM prescriptionParser.js path is EC-Agentic-AI\FRONTEND\front_end_js\dashboard\prescriptions\prescriptionParser.js")
  
// export async function pushingPrescriptionDataToDB(file) {
//     if (!file) {
//         console.log("No file provided!");
//         return;
//     }

//     // Use the uploaded file to get parsed prescription data
//     const parsedOutput = await handlePrescriptionUpload(file);

//     if (!parsedOutput) {
//         console.log("No data parsed from prescription.");
//         return;
//     }

//     try {
//         await addDoc(collection(db, "USERS_PRESCRIPTIONS"), {
//             medicine: parsedOutput.medicines,
//             dose: parsedOutput.doses,
//             timing: parsedOutput.timings,
//             doctor: parsedOutput.doctor,
//             other: parsedOutput.other
//         });
//         console.log("PRESCRIPTION ADDED TO FIRESTORE");
//     } catch (err) {
//         console.log("ERROR IN ADDING DATA TO DB", err);
//     }
// }

// // pushingPrescriptionDataToDB()