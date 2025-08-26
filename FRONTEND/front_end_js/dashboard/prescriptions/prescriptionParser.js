// importing the Tesseract from the Tesseract CDN , Tesseract is a js lib that helps us to convert a img ka content into plain text so we can use that later
// here we are using Tesseract to make thing simple so we can extract the test from a handwritten prescription 
import Tesseract from "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.esm.min.js";



const inputFile = "/EC-Agentic-AI/FRONTEND/front_end_js/dashboard/prescriptions/test_input2.png" //test subject
const apiKey = "AIzaSyB2FUrFBg2ivlJikLTtbiYOXWtS_IyXzd0"; //gemini api key REMOVE IN PRODUCTION

// const inputURL = URL.createObjectURL(inputFile)

// function responsible for the convertion of text within the image to actual usable text
async function imageTextExtraction() {
    try {
        const result = await Tesseract.recognize(inputFile, 'eng', {
            logger: info => console.log(info)
        })

        // console.log("FINAL OUTPUT = ", result.data.text)
        return result.data.text;
    }
    catch (error) {
        console.log("ERROR :", error)
        return error;
    }
}



// this fucntion is responsible for proper formatting of the raw text that has been extracted from the imageTextExtration()
async function geminiDataParsing(plaintext) {

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
                                        6. Also make sure the spelling is corrected for all the medicines`
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
                        maxOutputTokens: 100,
                        temperature: 0.2
                    }
                }),
            }
        );


        
        const data = await response.json() // fetching the data from 
        const textOutput = data.candidates[0].content.parts[0].text;

        // section responsible for converting the raw text into json structure so we can convert the text into json format
        const jsonStart = textOutput.indexOf("{");
        const jsonEnd = textOutput.lastIndexOf("}") + 1;
        const cleanJson = textOutput.substring(jsonStart, jsonEnd);

        // section responsible for the parsing of data into json format from where we can start accessing the data
        const parsedOutput = JSON.parse(cleanJson)

        // return parsedOutput[`medicine${1}`]


        // var that are being used to save the data from the parsed details individually  
        let medicines = [];
        let doses = [];
        let timings = [];


        // logic to iterate through all the elements within the json
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
        console.log("ERROR IN THE GEMINI MODEL : ", error)
        return null
    }


    // return finalparsedOutput;
}



const finalOutput = await imageTextExtraction()
console.log("FINAL OUTPUT : ", finalOutput)

const parsedOutput = await geminiDataParsing(finalOutput)
console.log("PARSED OUTPUT : ", parsedOutput.medicines[0])