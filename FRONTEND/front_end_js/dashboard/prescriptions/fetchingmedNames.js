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

const cardTemplate = document.querySelector("#medicine_card_template");
const cardsContainer = document.querySelector("#cards_container");


// function fetching all the medicine names that are store in the db
async function fetchingMedicineDetails() {
    const medicineDBCollection = collection(db, "USERS_PRESCRIPTIONS");
    const snapshot = await getDocs(medicineDBCollection);
    const medicineDetails = snapshot.docs.map(doc => doc.data());

    console.log("MEDICINE COUNT : ", medicineDetails.length); // debug purpose

    const medicineCount = [9 , 1 , 2 , 7 , 5] 

    medicineDetails.forEach((prescription) => {
        prescription.medicine.forEach((med, index) => {
            // clone  of the template
            const newCard = cardTemplate.cloneNode(true);
            newCard.classList.remove("hidden"); 

            // update medicine name 
            newCard.querySelector(".medicine_name").textContent = med;


            // adding the medicine stock number and the medicine percentage for the progress bar 
            const medicineCountForPercentage = getRandomElement(medicineCount)
            newCard.querySelector(".medicine_count").textContent = `${medicineCountForPercentage}/${10}`;
            newCard.querySelector(".medicine_bar").style.width = medicineCountForPercentage / 10 * 100 + "%";

            // adding the clone into the main parent continer
            cardsContainer.appendChild(newCard);
        });
    });
}

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

fetchingMedicineDetails();
