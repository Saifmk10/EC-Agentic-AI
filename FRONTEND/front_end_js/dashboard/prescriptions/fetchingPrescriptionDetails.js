// this file is used to fetch the primiary details from the prescription added and convert that into a card format that can be displayed in the ui


// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAVbsFHucj0GXOM0cLViDc1Enw0pmULNAQ",
    authDomain: "ec-agentic-ai-db.firebaseapp.com",
    projectId: "ec-agentic-ai-db",
    storageBucket: "ec-agentic-ai-db.firebasestorage.app",
    messagingSenderId: "454169373003",
    appId: "1:454169373003:web:8a422fd4e3b272d3d720ce",
    measurementId: "G-BGSZ0BD2RQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Elements
const prescriptionsList = document.getElementById("prescriptions-list");
const cardTemplate = document.getElementById("prescription_card");
const noPrescriptions = document.getElementById("no_prescriptions");

// Fetch prescription details from Firestore
async function fetchingPrescriptionDetails() {
    const prescriptionsCol = collection(db, "USERS_PRESCRIPTIONS");
    const snapshot = await getDocs(prescriptionsCol);
    const prescriptionDetails = snapshot.docs.map(doc => doc.data());

    console.log("Total prescriptions:", prescriptionDetails.length);

    if (!cardTemplate || !prescriptionsList) return;

    if (prescriptionDetails.length === 0) {
        noPrescriptions.style.display = "block";
    } else {
        noPrescriptions.style.display = "none";

        prescriptionDetails.forEach(app => {
            const newCard = cardTemplate.cloneNode(true);
            newCard.removeAttribute("id");
            newCard.classList.remove("hidden");

            // Update doctor name
            const doctorSpan = newCard.querySelector(".prescription_card_doctor_name");
            if (doctorSpan) doctorSpan.textContent = app.doctor || "Not specified";

            // Update hospital name
            const hospitalEl = newCard.querySelector(".prescription_card_hospital");
            if (hospitalEl) hospitalEl.textContent = app.hospital || "Not specified";

            const meds = newCard.querySelector(".medicine_name")
            if (meds) meds.textContent = app.medicine || "Not specified";

            prescriptionsList.appendChild(newCard);
        });
    }
}

fetchingPrescriptionDetails();
