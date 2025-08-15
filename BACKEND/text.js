const API_URL = 'https://ec-agentic-ai-backend-2onhyjxxx-saifmks-projects.vercel.app/api/runModel';


async function callApi() {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'cancel the appointment with Robert at 9am tomorrow'
      })
    });

    console.log("Status:", response.status);
    const text = await response.text(); // read raw text
    console.log("Raw response:", text);

    // Try parsing JSON only if status is 200
    if (response.ok) {
      const data = JSON.parse(text);
      console.log('API response:', data);
    }
  } catch (err) {
    console.error('Error calling API:', err);
  }
}

callApi();
