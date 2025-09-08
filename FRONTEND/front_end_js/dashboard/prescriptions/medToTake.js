function medicationReminder(text) {

  try {

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.7;
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


medicationReminder("YOU HAVE AN UPCOMING MEDICATION AT 1:30PM MEDICINE IS ATORTIB.")