// importing the Tesseract from the Tesseract CDN , Tesseract is a js lib that helps us to convert a img ka content into plain text so we can use that later
// here we are using Tesseract to make thing simple so we can extract the test from a handwritten prescription 
import Tesseract from "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.esm.min.js";

// const inputFile = "/EC-Agentic-AI/FRONTEND/front_end_js/dashboard/prescriptions/test_input2.png" //test subject
const apiKey = "AIzaSyB2FUrFBg2ivlJikLTtbiYOXWtS_IyXzd0"; //gemini api key REMOVE IN PRODUCTION

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// function responsible for the conversion of text within the image to actual usable text
export async function imageTextExtraction(inputFile) {
    try {
        const result = await Tesseract.recognize(inputFile, 'eng', {
            logger: info => console.log(info)
        });
        return result.data.text;
    }
    catch (error) {
        console.log("ERROR :", error);
        return null;
    }
}

// this fucntion is responsible for proper formatting of the raw text that has been extracted from the imageTextExtration()
export async function geminiDataParsing(plaintext) {
    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [
                                {
                                    text: `You are a medical data extraction bot. 
                                            Your task is to analyze the user's text (prescription, medical note, or message) and return ONLY valid JSON in this exact format:

                                            {
                                                "medicine0": "string",
                                                "dose0": "string",
                                                "timing0": "string",
                                                "medicine1": "string",
                                                "dose1": "string",
                                                "timing1": "string",
                                                "doctor_name": "string",
                                                "other_info": "string"
                                            }

                                        Rules:
                                        1. Always start numbering medicines, doses, and timings from 0, then increase sequentially (medicine0, medicine1, medicine2...).
                                        2. If timing is mentioned (e.g., "after food", "before bed"), put it under the corresponding timingN.
                                        3. If a field is missing, fill it with null.
                                        4. If there are multiple medicines, repeat the pattern (medicineN, doseN, timingN) for each.
                                        5. Do NOT wrap the JSON in code blocks, markdown, or extra text — output ONLY raw JSON. 
                                        6. Also make sure the spelling is corrected for all the medicines
                                        7. Ignore extra characters, symbols, or broken formatting
                                        8.Return results strictly in this JSON format`
                                }
                            ]
                        },

                        {
                            role: "user",
                            parts: [
                                { text: plaintext }
                            ]
                        }
                    ],
                    generationConfig: {
                        maxOutputTokens: 500,
                        temperature: 0.2
                    }
                }),
            }
        );

        const data = await response.json();
        const textOutput = data.candidates[0].content.parts[0].text;
        console.log("GEMINI RESPONSE : " , textOutput);

        // extract the clean JSON substring
        const jsonStart = textOutput.indexOf("{");
        const jsonEnd = textOutput.lastIndexOf("}") + 1;
        const cleanJson = textOutput.substring(jsonStart, jsonEnd);

        // parse JSON
        const parsedOutput = JSON.parse(cleanJson);

        let medicines = [];
        let doses = [];
        let timings = [];

        let i = 0;
        while (parsedOutput[`medicine${i}`]) {
            medicines.push(parsedOutput[`medicine${i}`]);
            doses.push(parsedOutput[`dose${i}`]);
            timings.push(parsedOutput[`timing${i}`]);
            i++;
        }

        return { medicines, doses, timings, doctor: parsedOutput.doctor_name, other: parsedOutput.other_info };

    }
    catch (error) {
        console.log("ERROR IN THE GEMINI MODEL : ", error);
        return null;
    }
}

// Handles file input + parsing workflow
export async function handlePrescriptionUpload(file) {
    if (!file) {
        console.log("No file selected.");
        return null;
    }

    console.log("Selected file:", file.name);

    // 1. Extract text from image
    const finalOutput = await imageTextExtraction(file);
    console.log("FINAL OUTPUT:", finalOutput);

    // 2. Parse extracted text with Gemini
    const parsedOutput = await geminiDataParsing(finalOutput);
    console.log("PARSED OUTPUT:", parsedOutput);

    return parsedOutput;  // this can be passed to DB or used directly
}

// adding the json content into the db 
export async function pushingPrescriptionDataToDB(file) {
    const parsedOutput = await handlePrescriptionUpload(file);
    if (!parsedOutput) return;

    try {
        await addDoc(collection(db, "USERS_PRESCRIPTIONS"), {
            medicine: parsedOutput.medicines,
            dose: parsedOutput.doses,
            timing: parsedOutput.timings,
            doctor: parsedOutput.doctor,
            other: parsedOutput.other
        });
        console.log("PRESCRIPTION ADDED TO FIRESTORE");
    } catch (err) {
        console.log("ERROR IN ADDING DATA TO DB", err);
    }
}
