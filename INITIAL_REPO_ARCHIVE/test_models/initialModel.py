# this is a code that is used to conver the raw text a user enters into a token format and eventually into 

from transformers import DistilBertTokenizer , DistilBertModel;
import torch;
import speech_recognition as sr

audioInput = sr.Recognizer()
with sr.Microphone() as source :
    print("Speak something im listening: ")
    audio = audioInput.listen(source)
    
    try:
        userInputViaVoiceModule = audioInput.recognize_google(audio)
        print(f"User Said: {userInputViaVoiceModule}")
    except sr.UnknownValueError:
        print("Sorry, I could not understand the audio.")
    except sr.RequestError:
        print("Could not request results, check your internet connection.")


tokenizer = DistilBertTokenizer.from_pretrained("distilbert-base-uncased")
model = DistilBertModel.from_pretrained("distilbert-base-uncased")

textViaVoice = userInputViaVoiceModule

userinput = tokenizer(textViaVoice , return_tensors = "pt")

print(f"TOKENIZED DATA : {userinput}")

with torch.no_grad() :
    output = model(**userinput)
    finalOutput = output.last_hidden_state
    print(finalOutput)

# realinput = tokenizer.decode(userinput)
# print(realinput)