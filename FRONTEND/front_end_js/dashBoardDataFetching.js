// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";
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
const analytics = getAnalytics(app);
const db = getFirestore(app);




const appointmentsList = document.getElementById("appointments-list");
const cardTemplate = document.getElementById("appointment_card");
const noAppointments = document.getElementById("no_appointments")

async function fetchingAppointmentDetails() {

    //fetching the data from the firebase db 
    const appointmentCol = collection(db, "DOCTOR_APPOINTMENT");
    const snapshot = await getDocs(appointmentCol);
    const appointmentDetails = snapshot.docs.map(doc => doc.data());

    console.log("Total appointments:", appointmentDetails.length);



    //printing the fetched data for element 0 of the json for debug purpose 

    console.log(appointmentDetails[0].doctorName);
    console.log(appointmentDetails[0].appointmentDate);
    console.log(appointmentDetails[0].appointmentTime);
    console.log(appointmentDetails[0].hospitalName);


    // logic for incrementing of the details card holding doc name , time , date etc
    if (appointmentDetails.length === 0) {
    noAppointments.style.display = "block"
} else {
    noAppointments.style.display = "none"
    appointmentDetails.forEach(app => {
        const newCard = cardTemplate.cloneNode(true);
        newCard.removeAttribute("id");
        newCard.classList.remove("hidden");
        
        newCard.querySelector(".appointment_card_doctor_name").textContent = app.doctorName || "Not specified";
        newCard.querySelector(".appointment_card_time").textContent = app.appointmentTime || "Not specified";
        newCard.querySelector(".appointment_card_date").textContent = new Date(app.appointmentDate).toDateString() || "Not specified";
        newCard.querySelector(".appointment_card_hospital").textContent = app.hospitalName || "Not specified";

        appointmentsList.appendChild(newCard);
    });
}
}

fetchingAppointmentDetails();
