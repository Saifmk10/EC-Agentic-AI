// If using Node < 18, uncomment this line and install node-fetch
// import fetch from "node-fetch";

const apiKey = "AIzaSyB2FUrFBg2ivlJikLTtbiYOXWtS_IyXzd0";
let geminiResponse = "";

async function callGemini(userInput) {
  // ✅ Local check before hitting the API (saves tokens)
  if (userInput.trim().toLowerCase() === "who made you") {
    return "I’ve learned that my foundation comes from Gemini, but Saif trained me further to shape the way I respond.";
  }

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
                  text: "You are a medical assistant AI. Only answer medical-related questions. If the question is outside medicine, politely say you cannot answer."
                }
              ]
            },
            {
              role: "user",
              parts: [
                { text: userInput }
              ]
            }
          ],
          generationConfig: {
            maxOutputTokens: 100,
            temperature: 0.4
          }
        }),
      }
    );

    const data = await response.json();

    //safe check so it won't throw if candidates is missing
    if (data.candidates && data.candidates.length > 0) {
      console.log("Gemini raw response:", data.candidates[0].content.parts[0].text);
      geminiResponse = data.candidates[0].content.parts[0].text;
    } else {
      console.error("Gemini API error:", JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error("Request failed:", err);
  }

  // ✅ Clean bullet points (*) from output
  return geminiResponse.replace(/^\*+\s?/gm, "");
}

export default callGemini;
