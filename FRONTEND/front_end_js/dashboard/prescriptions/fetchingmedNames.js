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
let randomMedForReminder = ""
let randomDosageForReminder = ""




// function fetching all the medicine names that are store in the db
async function fetchingMedicineDetails() {
  const medicineDBCollection = collection(db, "USERS_PRESCRIPTIONS");
  const snapshot = await getDocs(medicineDBCollection);
  const medicineDetails = snapshot.docs.map(doc => doc.data());

  console.log("MEDICINE COUNT : ", medicineDetails.length); // debug purpose

  const medicineCount = [9, 1, 2, 7, 5]
  const randomeDosage = [12, 15, 20, 25]

  medicineDetails.forEach((prescription) => {

    randomMedForReminder = getRandomElement(prescription.medicine) // this will be taking a random med form the db and be using it for the med reminder
    randomDosageForReminder = getRandomElement(randomeDosage)

    prescription.medicine.forEach((med, index) => {
      // fetching the medicine doses
      const dosage = prescription.dose[index];


      // clone  of the template
      const newCard = cardTemplate.cloneNode(true);
      newCard.classList.remove("hidden");

      // update medicine name 
      newCard.querySelector(".medicine_name").textContent = med;
      newCard.querySelector(".medicine_dose").textContent = dosage;
      // console.log('THIS IS THE OUPUT FROM MED IN fetchingNames.js file : ' , med)


      // console.log('THIS IS THE OUPUT FROM RANDOM MED IN fetchingNames.js file : ' , randomMedForReminder)

      // adding the medicine stock number and the medicine percentage for the progress bar 
      const medicineCountForPercentage = getRandomElement(medicineCount)
      newCard.querySelector(".medicine_count").textContent = `${medicineCountForPercentage}/${10}`;
      newCard.querySelector(".medicine_bar").style.width = medicineCountForPercentage / 10 * 100 + "%";

      // adding the clone into the main parent continer
      cardsContainer.appendChild(newCard);
    });
  });




  // user reminder for the meds (random med and random time -> current time + 10 mins)
  const time = new Date();
  time.setMinutes(time.getMinutes() + 10);

  let hours = time.getHours();
  const mins = time.getMinutes().toString().padStart(2, "0");

  // figure out AM/PM
  const ampm = hours >= 12 ? "PM" : "AM";

  // convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // if 0 → make it 12
  hours = hours.toString().padStart(2, "0");

  const finalTime = `${hours}:${mins} ${ampm}`;
  console.log("TIME +10 MIN:", finalTime);

  // med name for the medicine reminder
  const medName = document.getElementsByClassName("med_name")[0];
  medName.textContent = randomMedForReminder;
  // med timing or the medicine reminder
  const medTiming = document.getElementsByClassName("med_timing")[0];
  medTiming.textContent = finalTime;

  // medication reminder , voice and console
  medicationReminder(`YOU HAVE AN UPCOMING MEDICATION AT ${finalTime} ,  MEDICINE is ${randomMedForReminder} and DOSAGE is ${randomDosageForReminder} ML.`)
  console.log('THIS IS THE OUPUT FROM RANDOM MED IN fetchingNames.js file : ', randomMedForReminder);

}

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}



function medicationReminder(text) {

  try {

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.5;
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




fetchingMedicineDetails();
