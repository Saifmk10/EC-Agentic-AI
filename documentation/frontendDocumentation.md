<h2>FRONT END DIR MANAGEMENT DOCUMENTATION</h2>


Front end documentation will cover most of the tech stack and the file architecture that has been used for the front end of this application

TECH STACK USED : TailwindCss , JavaScript

FILE MANAGEMENT : 
- For the file managaement ive used an approach where all the features within the model are being split into different modules and focuses on improved modularity of the software.
- Bellow provided in the file structure for the front end the holds other files containg other modules too. This file structure is the structure pushed into production into vercel


<pre style="color: #4ade80; background: #000000;">
    EC-AGENTIC-AI/
└─ frontend/
   ├─ .vercel/
   ├─ assets/
   ├─ front_end_js/
   ├─ .gitignore
   ├─ dashboard.html
   ├─ index.html
   ├─ input.css
   ├─ output.css
   ├─ vercel.json
   └─ VoiceAssistant.html
</pre>

- Link to the production done within vercel for frontend (dynamic) [click to navigate](https://vercel.com/saifmks-projects/ec-agentic-ai-frontend)
    
- For the code containing model you will need to refer to another dir as mentioned bellow 

<pre style="color: #4ade80; background: #000000;">
front_end_js/
├─ dashboard/
├─ voiceAssistantfunctionModules/
├─ geminiApiCall.js
└─ voiceModel.js
</pre>

<h2>front_end_js DIR EXPLANATION</h2>
1. dashboard dir is a part of the modularity and contains all the file that are reponsible for various feature related code. The file within this dir are mentioned bellow along with its usage. 

<pre style="color: #4ade80; background: #000000;">
front_end_js/
├─ dashboard/
├─ voiceAssistantfunctionModules/
</pre>

- dashboard dir contains 2 other dirs appoinments and presciptions . The appointment dir contains a file called appointmentDetails.js that is responsible for fetching the appointment details from the db and adding that into the front end.

- the presciptions dir contains all 4 files and they perform the following tasks. fetchingmedNames.js -> responsible for the medicine names from the db. fetchingPrescriptionDetails.js -> responsible for fetching the prescription details that was uploaded by the users. medToTake.js -> responsible for selecting the med that the user needs to be taking at a particular time. 