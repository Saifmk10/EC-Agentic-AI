// this is a generative model that is only used to generate the answers for the doubts asked buy the users


const apiKey = "AIzaSyDRzhTpzngo6aKSuj8OoxmuNRu3MKj9954"; // api key keep expiring ig after a particular period of time , so if there is not response for the query just generate a new api key
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
                  text: "You are a concise medical assistant AI. • Only answer health or medicine-related questions. • If asked anything else, politely decline. • If the user mentions symptoms or health issues, suggest booking a doctor’s appointment in the relevant specialty and tell them to tap the agent to book. • Keep every response ≤50 words and include only the most important medical information."
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
            temperature: 2
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
